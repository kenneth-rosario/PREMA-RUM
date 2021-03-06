import {PopupRequest, PublicClientApplication} from "@azure/msal-browser";

export const HOST = process.env.NEXT_PUBLIC_HOST;

export const TOKEN_REQUEST:PopupRequest = {
    scopes:["api://83c3cbe7-f00e-4ea8-87d8-bf4d75690f17/access_as_user"]
}

// MSAL configuration
export const pca = new PublicClientApplication({
    auth: {
        clientId: "83c3cbe7-f00e-4ea8-87d8-bf4d75690f17",
        authority: "https://login.microsoftonline.com/0dfa5dc0-036f-4615-99e4-94af822f2b84",
        redirectUri:"/blank.html"
    },
    cache: {
        cacheLocation: "sessionStorage", // This configures where your cache will be stored
        storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
    }
});

export const graphConfig = {
    graphMePhotoEndpoint: "https://graph.microsoft.com/v1.0/me/photo/$value"
};