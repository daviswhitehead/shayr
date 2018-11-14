import React, { Component } from "react";
import { View } from "react-native";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { NavigationActions } from "react-navigation";
import Feed from "../../containers/Feed";

import { loadSelf, loadFriendships } from "../../redux/social/SocialActions";

const mapStateToProps = state => {
  return {
    auth: state.auth,
    social: state.social
  };
};

const mapDispatchToProps = dispatch => {
  return {
    loadFriendships: userId => dispatch(loadFriendships(userId)),
    loadSelf: userId => dispatch(loadSelf(userId))
  };
};

class LoginListener extends Component {
  // Set up all post-login listeners that should persist across screens
  // Navigate to the landing screen
  constructor() {
    super();
    this.subscriptions = [];
  }

  static propTypes = {};

  static navigationOptions = {
    title: "feed"
  };

  componentDidMount() {
    this.subscriptions.push(
      this.props.loadSelf(this.props.auth.user.uid),
      this.props.loadFriendships(this.props.auth.user.uid)
    );
  }

  componentWillUnmount() {
    console.log("here");
    console.log(this.subscriptions);
    for (var subscription in this.subscriptions) {
      console.log(subscription);
      if (this.subscriptions.hasOwnProperty(subscription)) {
        console.log("inside");
        console.log(this.subscriptions.subscription);
        console.log(this.subscriptions[subscription]);
        this.subscriptions[subscription]();
        console.log("success");
      }
    }
  }

  render() {
    return <Feed />;
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginListener);
