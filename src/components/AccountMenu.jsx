import React from "react";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import PopupState, {bindTrigger, bindMenu} from "material-ui-popup-state";
import theme from "../themes";
import {connect} from "react-redux";
import {withStyles} from "@material-ui/styles";
import {
  setIsViewBadgesDialogOpen,
  setIsChangePasswordDialogOpen,
  setUserProfileDialogOpen,
  setIsReviewDialogOpen,
} from "../actions/welcomePage";
import {getMyBadges, getUserProfile} from "../services/customerService";
import {
  setIsEntityListDialogOpen,
  setIsViewFeedbackDialogOpen,
} from "../actions/ownerPage";

const styles = (theme) => ({
  menuList: {
    color: "#DCEFDE",
  },
  sentenceCase: {
    textTransform: "none",
    fontSize: "13px",
    marginLeft: "10px",
  },
  accountButton: {
    height: theme.spacing(10),
    paddingRight: theme.spacing(2),
    paddingLeft: theme.spacing(2),
  },
});

const MyMenuItem = withStyles({
  root: {
    "&:hover": {
      backgroundColor: "#DCEFDE",
    },
  },
})(MenuItem);

//Component that displays various the menu options on clicking the account button on the header
function AccountMenu(props) {
  const {
    classes,
    setIsViewBadgesDialogOpen,
    getMyBadges,
    setIsChangePasswordDialogOpen,
    getUserProfile,
    setUserProfileDialogOpen,
    setIsEntityListDialogOpen,
    setIsReviewDialogOpen,
  } = props;
  const currentUrl = window.location.pathname;
  return (
    <PopupState variant="popover" popupId="account-menu">
      {(popupState) => (
        <React.Fragment>
          <Button {...bindTrigger(popupState)} className={classes.accountButton}>
            <AccountCircleIcon />
            <Typography className={classes.sentenceCase}>My Account</Typography>
          </Button>
          <Menu
            className={classes.menuList}
            getContentAnchorEl={null}
            anchorOrigin={{
              vertical: "center",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: -theme.spacing(3),
              horizontal: "right",
            }}
            {...bindMenu(popupState)}
          >
            <MyMenuItem
              onClick={async () => {
                await getUserProfile();
                setUserProfileDialogOpen(true);
                popupState.close();
              }}
            >
              View Profile
            </MyMenuItem>
            <MyMenuItem
              onClick={() => {
                setIsChangePasswordDialogOpen(true);
                popupState.close();
              }}
            >
              Change Password
            </MyMenuItem>
            {currentUrl === "/owner" && (
              <MyMenuItem
                onClick={() => {
                  setIsEntityListDialogOpen(true);
                  popupState.close();
                }}
              >
                View Pet/Plant
              </MyMenuItem>
            )}
            <MyMenuItem
              onClick={() => {
                getMyBadges();
                setIsViewBadgesDialogOpen(true);
                popupState.close();
              }}
            >
              View Badges
            </MyMenuItem>
            <MyMenuItem
              onClick={() => {
                setIsReviewDialogOpen(true);
                popupState.close();
              }}
            >
              My Reviews
            </MyMenuItem>
          </Menu>
        </React.Fragment>
      )}
    </PopupState>
  );
}

const mapStateToProps = ({loginPage: {snackBarData}}) => ({
  snackBarData,
});

const mapDispatchToProps = {
  setIsViewBadgesDialogOpen: setIsViewBadgesDialogOpen,
  setIsViewFeedbackDialogOpen: setIsViewFeedbackDialogOpen,
  getMyBadges: getMyBadges,
  setIsChangePasswordDialogOpen: setIsChangePasswordDialogOpen,
  getUserProfile: getUserProfile,
  setUserProfileDialogOpen: setUserProfileDialogOpen,
  setIsEntityListDialogOpen: setIsEntityListDialogOpen,
  setIsReviewDialogOpen: setIsReviewDialogOpen,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles, {withTheme: true})(AccountMenu));
