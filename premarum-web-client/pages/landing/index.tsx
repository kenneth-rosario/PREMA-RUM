import {Box, Button, Card, CardContent, Grid, Typography, useMediaQuery, useTheme} from "@mui/material";
import {useMsal} from "@azure/msal-react";
import {PopupRequest} from "@azure/msal-browser";
import getOrCreateUser from "../../utility/requests/getOrCreateUser";
import { TOKEN_REQUEST } from "../../utility/constants";
import {NextPage} from "next";
import {useRouter} from "next/router";
import React, {useState} from "react";
import OverlayIcons from "../../components/OverlayIcons";

type ButtonProps = {
    
}

const BREAKPOINT_SMALL = 350
const BREAKPOINT_MID = 750

const LoginButton: React.FunctionComponent<ButtonProps> = () => {
    const { instance, inProgress } = useMsal();
    const [loginLoading, setLoginLoading] = useState(false);
    const router = useRouter();
    
    if (inProgress === "login" || loginLoading) {
        return (
            <Button size="large" sx={classes.loginButton} disabled>
                Authentication In Progress...
            </Button>
        )
    }
    
    let loginRequest:PopupRequest = {
        ...TOKEN_REQUEST
    }
    
    async function loginBehavior() {
        setLoginLoading(true)
        try {
            const res = await instance.loginPopup(loginRequest)
            await instance.setActiveAccount(res.account)
        } catch(err: any) {
            alert("Login Failed. Try Again.");
            console.error(err);
            setLoginLoading(false)
            return
        }

        try {
            await getOrCreateUser(instance);
            await router.push("/home");
        } catch(err) {
            alert("Login Failed. Try Again.");
            console.error(err);
            await instance.logoutRedirect({
                onRedirectNavigate: (url) => {
                    return false
                }
            })
            setLoginLoading(false);
        }
    }
    
    return (
        <Button size="large" sx={classes.loginButton} onClick={loginBehavior}>
            Get Started
        </Button>
    )
}

export function DemoVideo() {
    const theme = useTheme()
    const matchesS = useMediaQuery(theme.breakpoints.down(BREAKPOINT_SMALL), {noSsr:true});
    const matchesM = useMediaQuery(theme.breakpoints.down(BREAKPOINT_MID), {noSsr:true});
    
    // if(matchesS){
    //     return(
    //         <iframe
    //             width="300"
    //             height="170"
    //             frameBorder="0"
    //             title="PREMARUM Demo Video"
    //             src="https://www.youtube.com/embed/dQw4w9WgXcQ"
    //         />
    //     )
    // } else if(matchesM) {
    //     return(
    //         <iframe
    //             width="480"
    //             height="270"
    //             frameBorder="0"
    //             title="PREMARUM Demo Video"
    //             src="https://www.youtube.com/embed/dQw4w9WgXcQ"
    //         />
    //     )
    // } else {
    //     return(
    //         <iframe
    //             width="720"
    //             height="420"
    //             frameBorder="0"
    //             title="PREMARUM Demo Video"
    //             src="https://www.youtube.com/embed/dQw4w9WgXcQ"
    //         />
    //     )
    // }

    return(
        <iframe
            width="100%"
            height="100%"
            frameBorder="0"
            title="PREMARUM Demo Video"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
        />
    )
}

export default function Landing() {

    return(
        <Box sx={classes.fullBox}>
            <OverlayIcons />
            
            <Box sx={classes.topBox}>
                <Grid container direction="column" justifyContent="center" alignItems="center" >
                    <Box
                        sx={classes.premaLogo}
                        component="img"
                        alt="PREMARUM"
                        src="prema-logo-white.png"
                    />
                    <Typography align="center" variant="h5" sx={classes.topSubtitle}>
                        The easiest way to prepare yourself for your next semester.<br/>
                        The app for creating enrollment logistical plans, storing, and sharing them with the community.
                    </Typography>
                    <LoginButton/>
                </Grid>
            </Box>

            <Box sx={classes.bottomBox}>
                <Grid container direction="column" justifyContent="center" alignItems="center">
                    <Typography align="center" variant="h3" sx={classes.bottomTitle}>What is PREMARUM?</Typography>
                    <Box sx={classes.videoBox}>
                        <Box sx={classes.videoBoxWrapper}>
                            <Box sx={classes.videoWrapper}>
                                <Box
                                    sx={classes.videoFrame}
                                    component="iframe"
                                    frameBorder="0"
                                    title="PREMARUM Demo Video"
                                    src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                                />
                            </Box>
                        </Box>
                    </Box>
                    <Typography align="center" variant="h5" sx={classes.bottomSubtitle}>Designed for UPRM students, by UPRM students.</Typography>
                    <Box
                        sx={classes.rumLogoBox}
                        component="img"
                        alt="UPRM"
                        src="rum-logo-transparent.svg"
                    />
                </Grid>
            </Box>
        
        </Box>
    )
}

Landing.getLayout = function getLayout(page: NextPage) {
    return (
        page
    )
}


const useStyles = {
    backImage: {
        position: 'absolute',
        opacity: 0.5,
        zIndex: 0,
        width: '100%',
        height: '100%',
    },
    loginButton: {
        color: 'black',
        backgroundColor: 'secondary.light',
        marginTop: 3,
        marginBottom: 4,
    },
    fullBox: {
        width: '100%',
        height: '100%',
    },
    topBox: {
        backgroundColor: 'primary.main',
        width: '100%',
        minHeight: '250px',
    },
    premaLogo: {
        width: '100%',
        height: '100%',
        maxWidth: '700px',
    },
    topTitle: {
        padding: '20px 20px 10px 20px',
    },
    topSubtitle: {
        width: '100%',
        padding: '0 20px',
    },
    bottomBox: {
        backgroundColor: 'secondary.main',
        width: '100%',
        height: '100%',
        minHeight: '500px',
    },
    videoBox: { 
        width: '100%',
        maxWidth: '720px',
        height: '100%',
        padding: '0 20px'
    },
    videoBoxWrapper: { // 16:9 ratio
        width: '100%',
        height: 0,
        paddingBottom: '56.25%',
        position: 'relative',
    },
    videoWrapper: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
    },
    videoFrame: {
        width: '100%',
        height: '100%',
    },
    bottomTitle: {
        padding: '20px 0',
    },
    bottomSubtitle: {
        padding: '20px',
    },
    rumLogoBox: {
        width: "250px",
        height: "250px",
        marginBottom: 3
    }
};
  
const classes = useStyles;