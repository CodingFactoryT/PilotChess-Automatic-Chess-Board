import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
	pluginReact.configs.flat.recommended,
	{
		files: ["**/*.{js,mjs,cjs,jsx}"],
		plugins: { js },
		extends: ["js/recommended"],
		languageOptions: {
			ecmaVersion: "latest",
			sourceType: "module",
			globals: globals.browser,
			parserOptions: {
				ecmaFeatures: {
					jsx: true,
				},
			},
		},
		rules: {
			"react/react-in-jsx-scope": "off",
			"react/prop-types": "off",
		},
		settings: {
			react: {
				version: "detect",
			},
		},
	},
]);
