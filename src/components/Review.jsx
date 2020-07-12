import React, {useEffect, useState} from "react";
import {
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@material-ui/core";
import {connect} from "react-redux";
import {withStyles} from "@material-ui/styles";
import {setIsReviewDialogOpen} from "../actions/welcomePage";
import {getReviewsByMyCaretakerId} from "../services/reviewService";
import {fetchFailed} from "../constants";
import {isAuthenticated} from "../services/loginService";
import {showSnackBar} from "../actions/loginPage";

const styles = (theme) => ({
  displayUs: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    margin: theme.spacing(1),
  },
  gridContainerPerson: {},
  gridContainerDialog: {},
  nameText: {},
  photo: {
    height: "250px",
    width: "200px",
  },
  reviewCardId: {},
  reviewCardContent: {},
});

function Review(props) {
  const {classes, history, isReviewDialogOpen, setIsReviewDialogOpen} = props;
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    function getReviews() {
      getReviewsByMyCaretakerId()
        .then((response) => {
          setReviews(response);
        })
        .catch((_) => {
          showSnackBar(true, fetchFailed, "error loading reviews");
        });
    }
    if (!isAuthenticated()) {
      history.push("/");
      window.location.reload();
    }
    getReviews();
  }, [history]);

  function getGridReviewItem(index, review) {
    return (
      <div key={index}>
        <Card variant="outlined">
          <CardContent className={classes.reviewCardContent}>
            <div className={classes.reviewCardId}>{review.caretaker}</div>
            <div className={classes.reviewCardId}>{review.text}</div>
            <div className={classes.reviewCardId}>{review.rating}</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Dialog open={isReviewDialogOpen} onClose={() => setIsReviewDialogOpen(false)}>
      <DialogTitle id="show-reviews" disableTypography={true}>
        <Typography variant="h5">Seba Team 55</Typography>
      </DialogTitle>
      <DialogContent>
        <div className={classes.displayUs}>
          <div className={classes.gridContainerDialog}>
            {reviews
              .filter((review) => {
                return true;
              })
              .map((review, index) => getGridReviewItem(index, review))}
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setIsReviewDialogOpen(false)} color="secondary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

const mapStateToProps = ({welcomePage: {isReviewDialogOpen}}) => ({
  isReviewDialogOpen,
});

const mapDispatchToProps = {
  setIsReviewDialogOpen: setIsReviewDialogOpen,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles, {withTheme: true})(Review));