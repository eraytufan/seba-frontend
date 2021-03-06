import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import {withStyles} from "@material-ui/styles";
import {Grid, Tab, Tabs} from "@material-ui/core";
import {
  changeFilterBy,
  changeSearch,
  setIsBiddingRequestDialogOpen,
} from "../actions/caretakerPage";
import BiddingRequestForm from "../components/BiddingRequestForm";
import {isAuthenticated} from "../services/loginService";
import {showSnackBar} from "../actions/loginPage";
import {fetchFailed, saveFailed, saveSuccess} from "../constants";
import FilterSearch from "../components/FilterSearch";
import CaretakerCard from "../components/CaretakerCard";
import Header from "../components/Header";
import {
  getAvailableOffers,
  getInterestedOffers,
  getNotInterestedOffers,
  getRejectedOffers,
  updateNotInterested,
} from "../services/offerService";
import MenuDialog from "../components/MenuDialog";
import NoData from "../components/NoData";

const tabs = [
  "Available",
  "Not Assigned",
  "Assigned to You",
  "Rejected",
  "Not Interested",
];
const isShowStatus = [false, false, true, false, false];
const getOfferServices = [
  getAvailableOffers,
  getInterestedOffers,
  getInterestedOffers,
  getRejectedOffers,
  getNotInterestedOffers,
];
const noOfferMessages = [
  "No offer is available for now. Please check again later.",
  "There is no unassigned offer.",
  "You have no assigned offer.",
  "There is no offer.",
  "There is no uninterested offer.",
];
const filterByOptions = ["Owner", "Description"];
const styles = (theme) => ({
  caretakerGreeting: {
    fontSize: "24px",
  },
  container: {
    margin: `${theme.spacing(5)}px auto 0 auto`,
    width: "80%",
  },
  body: {
    marginTop: theme.spacing(5),
    height: "calc(100vh - 350px)",
    overflowY: "auto",
    overflowX: "hidden",
  },
  noDataFound: {
    margin: "25px auto",
  },
  noDataFoundImageContainer: {
    textAlign: "center",
  },
  noDataFoundImage: {
    width: "250px",
  },
  noDataFoundTextContainer: {
    textAlign: "center",
  },
  noDataFoundText: {
    fontSize: "14pt",
  },
  tabOption: {
    marginTop: theme.spacing(4),
    borderBottom: `1px solid rgba(0, 0, 0, 0.3)`,
  },
  tabActive: {
    color: theme.palette.secondary.contrastText,
    background: theme.palette.secondary.main,
    opacity: 1,
  },
});

function CaretakerPage(props) {
  const {
    history,
    sock,
    classes,
    selectedFilterBy,
    searchValue,
    changeFilterBy,
    changeSearch,
    setIsBiddingRequestDialogOpen,
    showSnackBar,
  } = props;

  const [offers, setOffers] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  if (!isAuthenticated()) {
    history.push("/");
    window.location.reload();
  }
  function filterOffer(index, offer) {
    if (index === 1) {
      return offer.status === "Not Assigned";
    } else if (index === 2) {
      if (offer.approvedBiddingRequest)
        return (
          offer.approvedBiddingRequest.caretaker.username === localStorage["username"]
        );
      return false;
    }
    return true;
  }
  function getOffers(index) {
    getOfferServices[index]()
      .then((offers) => {
        const displayedOffers = offers.filter((offer) => filterOffer(index, offer));
        setOffers(displayedOffers);
      })
      .catch((status) => {
        if (status === 401) {
          history.push("/");
          window.location.reload();
        }
        showSnackBar(true, fetchFailed, "error");
      });
  }

  function saveSuccessCallback() {
    getAvailableOffers()
      .then((offers) => {
        setOffers(offers);
      })
      .catch((status) => {
        if (status === 401) {
          history.push("/");
          window.location.reload();
        }
        showSnackBar(true, saveFailed, "error");
      });
  }

  useEffect(() => {
    getOfferServices[0]()
      .then((offers) => {
        setOffers(offers);
      })
      .catch((status) => {
        if (status === 401) {
          history.push("/");
          window.location.reload();
        }
        showSnackBar(true, fetchFailed, "error");
      });
  }, [history, showSnackBar]);

  function handleTabClick(index) {
    setActiveTab(index);
    getOffers(index);
  }

  function handleNotInterestedCallback(offerId) {
    updateNotInterested(offerId)
      .then(() => {
        showSnackBar(true, saveSuccess, "success");
        saveSuccessCallback();
      })
      .catch((status) => {
        if (status === 401) {
          history.push("/");
          window.location.reload();
        }
        showSnackBar(true, saveFailed, "error");
      });
  }

  const filteredOffers = offers
    .filter((offer) => {
      var searchRegex = new RegExp(searchValue, "gi");
      if (searchValue === "") {
        return true;
      }
      if (selectedFilterBy === 1) {
        if (searchRegex.test(offer.owner.username.toString())) {
          return true;
        }
      } else if (selectedFilterBy === 2) {
        if (searchRegex.test(offer.description)) {
          return true;
        }
      } else if (selectedFilterBy === "") {
        return true;
      }
      return false;
    })
    .map((offer, index) => {
      return (
        <Grid item xs={12} md={6} lg={3} key={offer._id}>
          <CaretakerCard
            key={index}
            offer={offer}
            tab={activeTab}
            interestedCallback={() => setIsBiddingRequestDialogOpen(true, offer._id)}
            notInterestedCallback={() => handleNotInterestedCallback(offer._id)}
            history
            isShowStatus={isShowStatus[activeTab]}
          />
        </Grid>
      );
    });

  return (
    <div>
      <div>
        <Header history={history} />
      </div>
      <div className={classes.container}>
        <div>
          <Grid container spacing={3}>
            <Grid className={classes.caretakerGreeting} item xs={12} md={3}>
              Hello, Caretaker {localStorage["username"]}
            </Grid>
            <Grid item xs={"auto"} md={2} lg={4} />
            <Grid item xs={12} md={7} lg={5}>
              <FilterSearch
                filterOptions={filterByOptions}
                changeFilterCallback={(value) => changeFilterBy(value)}
                changeSearchQueryCallback={(value) => changeSearch(value)}
              />
            </Grid>
          </Grid>
        </div>
        <div className={classes.tabOption}>
          <Tabs value={activeTab}>
            {tabs.map((tab, index) => (
              <Tab
                key={index}
                value={index}
                className={activeTab === index ? classes.tabActive : ""}
                label={tab}
                onClick={() => handleTabClick(index)}
              />
            ))}
          </Tabs>
        </div>
        <div className={classes.body}>
          <Grid container spacing={2}>
            {offers.length > 0 ? (
              filteredOffers.length > 0 ? (
                filteredOffers
              ) : (
                <NoData text={"There is no offer based on your search."} />
              )
            ) : (
              <NoData text={noOfferMessages[activeTab]} />
            )}
          </Grid>
        </div>
        <BiddingRequestForm
          history={history}
          successCallback={saveSuccessCallback}
          sock={sock}
        />
        <MenuDialog />
      </div>
    </div>
  );
}

const mapStateToProps = ({caretakerPage: {selectedFilterBy, searchValue}}) => ({
  selectedFilterBy,
  searchValue,
});

const mapDispatchToProps = {
  changeFilterBy: changeFilterBy,
  changeSearch: changeSearch,
  setIsBiddingRequestDialogOpen: setIsBiddingRequestDialogOpen,
  showSnackBar: showSnackBar,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles, {withTheme: true})(CaretakerPage));
