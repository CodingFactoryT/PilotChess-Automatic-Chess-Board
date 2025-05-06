import { useState, useContext, createContext, useEffect } from "react";
import { useNavigate } from "react-router";
import { requestAuthorizationCode, obtainAccessToken } from "@src/helpers/AuthHelper";

import { apiGet, apiPost } from "@src/helpers/fetchBackendApi"
import config from "@shared/config.js";
const AuthContext = createContext();

const clientId = "pilotchess-codingfactoryt";
let searchParams;

const clientURL = (() => {	//prevents from displaying the query parameters in the browsers url
  const url = new URL(location.href);
  
	searchParams = {};
	url.searchParams.forEach((value, key) => {	//store the search params to be accessed later
		searchParams[key] = value;
	});

  url.search = ''; // remove query string
  
  history.replaceState({}, '', url.href); //update browser url that is visible to the user

  return url.href;
})();

//From the lichess api documentation (https://lichess.org/api#tag/Account/operation/accountMe):
const scope = [
	//"preference:read",	//Read your preferences
	//"preference:write",	//Write your preferences
	//"email:read",				//Read your email address
	//"engine:read",			//Read your external engines
	//"engine:write",			//Create, update, delete your external engines
	"challenge:read",			//Read incoming challenges
	"challenge:write",		//Create, accept, decline challenges
	//"challenge:bulk",		//Create, delete, query bulk pairings
	//"study:read",				//Read private studies and broadcasts
	//"study:write",			//Create, update, delete studies and broadcasts
	//"tournament:write",	//Create tournaments
	//"racer:write",			//Create and join puzzle races
	//"puzzle:read",			//Read puzzle activity
	//"team:read",				//Read private team information
	//"team:write",				//Join, leave teams
	//"team:lead",				//Manage teams (kick members, send PMs)
	"follow:read",				//Read followed players
	"follow:write" ,			//Follow and unfollow other players
	//"msg:write",				//Send private messages to other players
	"board:play",					//Play with the Board API
	//"bot:play",				 	//Play with the Bot API. Only for Bot accounts
	//"web:mod",					//Use moderator tools (within the bounds of your permissions)
].reduce((acc, current) => acc + current + " ", "");	//reduce them to one string with the scopes being separated by a space (=the format the lichess oauth needs)

export function useAuth() {
	return useContext(AuthContext);
}

export function AuthProvider({ children }) {
	const navigate = useNavigate();
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	useEffect(() => {
		const handlePageLoad = async () => {
			try {
				const response = await apiGet("/auth/check-access-token");
				const isTokenStillValid = response.data.authenticated;
				if(isTokenStillValid) {
					setIsAuthenticated(true);
					return;
				}
				const code = searchParams["code"];
				const responseState = searchParams["state"];

				//if these searchParameters are set, theres an ongoing login active
				if(code && responseState) {
					handleOngoingLogin(code, responseState);
				}
			} catch(error) {
				console.error(error)
			}
		}

		handlePageLoad();
	}, []);

	const handleOngoingLogin = async (code, responseState) => {
		const error = searchParams["error"];

		if(error) {
			console.error(`Authorization error: ${searchParams["error_description"]}`);
			return;
		}

		if(responseState !== sessionStorage.getItem("state")) {
			console.warn("States do not match, aborting login because of possible CSRF attack!");
			return;
		}
		
		const codeVerifier = sessionStorage.getItem("code_verifier");
		const data = await obtainAccessToken(config.lichess_base_url, code, codeVerifier, clientURL, clientId);
		await apiPost("/auth/set-access-token", { expiresIn_seconds: data.expires_in }, {headers: { Authorization: `Bearer ${data.access_token}` }});
		setIsAuthenticated(true);
	}

	const login = () => {
		requestAuthorizationCode(clientId, clientURL, scope);
	};

	const logout = () => {
		setIsAuthenticated(false);
		apiGet("/auth/logout").then(() => {
			navigate("/login", { replace: true });
		})
	};

	return <AuthContext.Provider value={{ isAuthenticated, login, logout }}>{children}</AuthContext.Provider>;
}
