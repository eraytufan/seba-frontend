import {
  ISVIEWBADGESDIALOGOPEN,
  ISABOUTUSDIALOGOPEN,
  ISREVIEWDIALOGOPEN,
  SAVEMYBADGES,
  CHANGEPASSWORD,
  NEWBADGEAVAILABLE,
  SAVEMYPROFILE,
  SETUSERPROFILEDIALOGOPEN,
  SETPROFILEFIELDVALUE,
} from "../actions/welcomePage";

let initialState = {
  isViewBadgesDialogOpen: false,
  isAboutUsDialogOpen: false,
  isReviewDialogOpen: false,
  userIdReview: "",
  myBadges: {},
  isChangePasswordDialogOpen: false,
  newBadge: null,
  newBadgeDialog: false,
  profileFields: {
    name: "",
    phoneNumber: "",
    address: "",
  },
  userProfileDialogOpen: false,
};

export default function welcomePage(state = initialState, action) {
  switch (action.type) {
    case ISVIEWBADGESDIALOGOPEN:
      return {
        ...state,
        isViewBadgesDialogOpen: action.value,
      };
    case SAVEMYBADGES:
      return {
        ...state,
        myBadges: action.value,
      };
    case CHANGEPASSWORD:
      return {
        ...state,
        isChangePasswordDialogOpen: action.value,
      };
    case NEWBADGEAVAILABLE:
      return {
        ...state,
        newBadge: action.value,
        newBadgeDialog: action.isOpen,
      };
    case SAVEMYPROFILE:
      return {
        ...state,
        profileFields: action.value,
      };
    case SETUSERPROFILEDIALOGOPEN:
      return {
        ...state,
        userProfileDialogOpen: action.value,
      };
    case SETPROFILEFIELDVALUE:
      return {
        ...state,
        profileFields: {...state.profileFields, [action.fieldName]: action.value},
      };
    case ISABOUTUSDIALOGOPEN:
      return {
        ...state,
        isAboutUsDialogOpen: action.value,
      };
    case ISREVIEWDIALOGOPEN:
      return {
        ...state,
        isReviewDialogOpen: action.value,
        userIdReview: action.userIdReview,
      };
    default:
      return {
        ...state,
      };
  }
}
