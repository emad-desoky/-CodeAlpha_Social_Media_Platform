import { Dialog, DialogTitle, DialogActions, List, ListItemText, Button, DialogContent, ListItem } from '@mui/material'
import { animated } from "@react-spring/web";
import { useSpring } from "@react-spring/web";
import { styled } from "@mui/material/styles";

const settings = {
    deleteAccount: false,
    safety: false,
    aboutUs: false,
    privacyPolicy: false,
    termsOfService: false,
}

 // Styled Dialog for Settings
 const StyledDialogContent = styled(DialogContent)({
    backgroundColor: "#f5f5f5",
    padding: "24px",
});

const StyledListItem = styled(ListItem)({
    borderRadius: "8px",
    marginBottom: "8px",
    backgroundColor: "#ffffff",
    "&:hover": {
        backgroundColor: "#e0e0e0",
    },
});


export default function SettingsDialog({openSettingsDialog, handleCloseSettingsDialog}) {

    // Animation for Settings Dialog
    const settingsDialogProps = useSpring({
        opacity: openSettingsDialog ? 1 : 0,
        transform: openSettingsDialog ? "scale(1)" : "scale(0.9)",
        config: { tension: 300, friction: 30 },
    });

    return (
        <Dialog open={openSettingsDialog} onClose={handleCloseSettingsDialog}>
            <animated.div style={settingsDialogProps}>
                <DialogTitle>Settings</DialogTitle>
                <StyledDialogContent>
                    <List>
                        {Object.keys(settings).map((setting) => (
                            <StyledListItem key={setting}>
                                <ListItemText primary={setting} />
                            </StyledListItem>
                        ))}
                    </List>
                </StyledDialogContent>
                <DialogActions>
                    <Button onClick={handleCloseSettingsDialog}>Close</Button>
                </DialogActions>
            </animated.div>
        </Dialog>
    )
}
