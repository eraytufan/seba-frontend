import React from "react";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import {withStyles} from "@material-ui/styles";

const styles = (theme) => ({
  root: {
    width: 250,
    margin: theme.spacing(2),
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
  cardImage: {
    objectFit: "scale-down",
  },
});

//Single Badge card that is displayed when the customer views his badges
function DisplayBadge(props) {
  const {classes, mybadge} = props;
  const badgeDate = () => {
    const date = new Date(mybadge.date);
    return date.toDateString();
  };
  return (
    <Card className={classes.root}>
      <CardHeader title={mybadge.badge.name} subheader={badgeDate()} />
      <CardMedia
        component="img"
        height="125"
        className={classes.cardImage}
        image={`data:image/png;base64, ${mybadge.badge.image}`}
        title={mybadge.badge.name}
      />
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          {mybadge.badge.description}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default withStyles(styles, {withTheme: true})(DisplayBadge);
