import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useSnackbar } from "notistack";

import useStyles from "./SearchBarUITheme";

import { convertMsToHumanFormat } from "../../helpers/dateTime";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Badge from "@material-ui/core/Badge";
import LinearProgress from "@material-ui/core/LinearProgress";
import IconButton from "@material-ui/core/IconButton";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import SearchForm from "../../components/SearchForm";

import GitHubIcon from "@material-ui/icons/GitHub";
import TimelapseIcon from "@material-ui/icons/Timelapse";
import i18n from "../../../i18n";

import { authLink } from "../../services/auth";

const SearchBar = ({ repos, findRepoByTitle, lastSearchedItem, user }) => {
  const [hasError, setHasError] = useState(false);
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const sendRequest = (title) => {
    if (!title) {
      setHasError(true);
      enqueueSnackbar(i18n.error("find.nothing", "We can't find nothing"), {
        variant: "error",
      });
      return;
    }

    setHasError(false);
    findRepoByTitle(title);
  };

  useEffect(() => {
    if (Boolean(repos.error)) {
      enqueueSnackbar(repos.error.message, { variant: repos.error.type });
    }
  }, [enqueueSnackbar, repos.error]);

  const goToAuthPage = () => {
    window.location.href = authLink;
  };

  return (
    <AppBar
      position="relative"
      className={`${classes.container} ${repos.pending ? classes.blocked : ""}`}
    >
      {repos.pending && (
        <div className={classes.progress}>
          <LinearProgress color="secondary"></LinearProgress>
        </div>
      )}
      <Toolbar>
        {!user.data && (
          <IconButton
            id="login-button"
            color="inherit"
            onClick={goToAuthPage}
            aria-label="authenticate"
          >
            <VpnKeyIcon />
          </IconButton>
        )}
        <SearchForm
          sendRequest={sendRequest}
          hasError={hasError}
          disabled={repos.pending}
          lastSearchedItem={lastSearchedItem}
        />
        {repos.total > 0 && (
          <Badge
            id="total-repos"
            badgeContent={repos.total}
            max={10000}
            color="primary"
          >
            <GitHubIcon />
          </Badge>
        )}
        {repos.responseTime > 0 && (
          <div className={classes.time} id="response-time">
            <TimelapseIcon />
            <div className={classes.timeAmount}>
              {convertMsToHumanFormat(repos.responseTime)}
            </div>
          </div>
        )}
      </Toolbar>
    </AppBar>
  );
};

SearchBar.propTypes = {
  repos: PropTypes.shape({
    responseTime: PropTypes.number,
    total: PropTypes.number.isRequired,
    pending: PropTypes.bool,
  }),
  findRepoByTitle: PropTypes.func.isRequired,
  lastSearchedItem: PropTypes.string,
  user: PropTypes.object,
};

export default React.memo(SearchBar);
