import { useState, useContext, createContext, useEffect } from "react";
import { useNavigate } from "react-router";
import { requestAuthorizationCode, obtainAccessToken } from "../helpers/AuthHelper";

import { apiGet, apiPost } from "../helpers/fetchBackendApi"
import config from "../../../config";
const AuthContext = createContext();

const clientId = "pilotchess-codingfactoryt";
let searchParams;

const clientURL = (() => {	//prevents from displaying the query parameters in the browsers url
  const url = new URL(location.href);
  
	searchParams = {};
	url.searchParams.forEach((value, key) => {
		searchParams[key] = value;
	});

  url.search = ''; // remove query string
  
  history.replaceState({}, '', url.href); //update browsers url

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
	//"bot:play",					//Play with the Bot API. Only for Bot accounts
	//"web:mod",					//Use moderator tools (within the bounds of your permissions)
].reduce((acc, current) => acc + current + " ", "");	//reduce them to one string with the scopes being separated by a space (=the format the lichess oauth needs)

export function useAuth() {
	return useContext(AuthContext);
}

export function AuthProvider({ children }) {
	const navigate = useNavigate();
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	useEffect(() => {
			apiGet("/auth/check-access-token")
			.then(res => {
				const isTokenStillValid = res.data.authenticated;
				if(isTokenStillValid) {
					setIsAuthenticated(true);
					return;
				} else {
					const code = searchParams["code"];
					const responseState = searchParams["state"];
					const error = searchParams["error"];
			
					if(error) {
						setIsAuthenticated(false);
						console.error(`Authorization error: ${searchParams["error_description"]}`);
					}
					
					if(code && responseState) {	//if a login was requested, proceed with the login
						if(responseState !== sessionStorage.getItem("state")) {
							setIsAuthenticated(false);
							console.warn("States do not match, aborting login because of possible CSRF attack!");
							return;
						}
						
						const codeVerifier = sessionStorage.getItem("code_verifier");
						obtainAccessToken(config.lichess_base_url, code, codeVerifier, clientURL, clientId).then(data => {
								apiPost("/auth/set-access-token-cookie", {
									expiresIn_seconds: data.expires_in
								}, {
									headers: { Authorization: `Bearer ${data.access_token}` }
								}).then(res => {
									setIsAuthenticated(true);
								}).catch(error => {
									setIsAuthenticated(false);
									console.error(error);
								})
						})
						.catch(error => {
							setIsAuthenticated(false);
							console.error(error);
						});
					} else {
						setIsAuthenticated(false);
					} 
				}
			})
			.catch(error => {
				console.error(error)
			});
	}, []);

	const login = () => {
		requestAuthorizationCode(clientId, clientURL, scope);
	};

	const logout = () => {
		setIsAuthenticated(false);
		apiGet("/auth/logout").then(res => {
			navigate("/login", { replace: true });
		})
	};

	return <AuthContext.Provider value={{ isAuthenticated, login, logout }}>{children}</AuthContext.Provider>;
}
