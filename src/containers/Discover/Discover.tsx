import { buildAppLink } from '@daviswhitehead/shayr-resources';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { connect } from 'react-redux';
import { subscribe } from 'redux-subscriber';
import ContentCard from '../../components/ContentCard';
import Header from '../../components/Header';
import List from '../../components/List';
import { startSignOut } from '../../redux/auth/actions';
import { subscribeToFriendships } from '../../redux/friendships/actions';
import { subscribeNotificationTokenRefresh } from '../../redux/notifications/actions';
import { postAction } from '../../redux/postActions/actions';
import {
  flattenPosts,
  loadPosts,
  paginatePosts,
  refreshPosts
} from '../../redux/posts/actions';
import { handleURLRoute, navigateToRoute } from '../../redux/routing/actions';
import { subscribeToUser } from '../../redux/users/actions';
import { loadUsersPosts } from '../../redux/usersPosts/actions';
import colors from '../../styles/Colors';
import styles from './styles';

const mapStateToProps = state => ({
  auth: state.auth,
  users: state.users,
  posts: state.posts,
  routing: state.routing
});

const mapDispatchToProps = dispatch => ({
  loadPosts: (userId, query) => dispatch(loadPosts(userId, query)),
  loadUsersPosts: (userId, query) => dispatch(loadUsersPosts(userId, query)),
  paginatePosts: (userId, query, lastPost) =>
    dispatch(paginatePosts(userId, query, lastPost)),
  refreshPosts: (userId, query) => dispatch(refreshPosts(userId, query)),
  postAction: (actionType, userId, postId) =>
    dispatch(postAction(actionType, userId, postId)),
  startSignOut: () => dispatch(startSignOut()),
  subscribeToUser: userId => dispatch(subscribeToUser(userId)),
  subscribeToFriendships: userId => dispatch(subscribeToFriendships(userId)),
  subscribeNotificationTokenRefresh: userId =>
    dispatch(subscribeNotificationTokenRefresh(userId)),
  navigateToRoute: payload => dispatch(navigateToRoute(payload)),
  handleURLRoute: payload => dispatch(handleURLRoute(payload))
});

class Discover extends Component {
  static propTypes = {
    auth: PropTypes.instanceOf(Object).isRequired,
    users: PropTypes.instanceOf(Object).isRequired,
    posts: PropTypes.instanceOf(Object).isRequired,
    routing: PropTypes.instanceOf(Object).isRequired,
    navigation: PropTypes.instanceOf(Object).isRequired,
    subscribeToUser: PropTypes.func.isRequired,
    subscribeToFriendships: PropTypes.func.isRequired,
    subscribeNotificationTokenRefresh: PropTypes.func.isRequired,
    navigateToRoute: PropTypes.func.isRequired,
    loadPosts: PropTypes.func.isRequired,
    loadUsersPosts: PropTypes.func.isRequired,
    handleURLRoute: PropTypes.func.isRequired,
    postAction: PropTypes.func.isRequired,
    paginatePosts: PropTypes.func.isRequired,
    refreshPosts: PropTypes.func.isRequired,
    startSignOut: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.subscriptions = [];
  }

  async componentDidMount() {
    // HOME - Listen to global datasets
    this.subscriptions.push(
      await this.props.subscribeToUser(this.props.auth.user.uid)
    );

    this.subscriptions.push(
      await this.props.subscribeToFriendships(this.props.auth.user.uid)
    );

    // HOME - Listen to notification token changes
    this.subscriptions.push(
      await this.props.subscribeNotificationTokenRefresh(
        this.props.auth.user.uid
      )
    );

    // HOME - Respond to initial route and listen to routing updates
    if (this.props.routing.screen) {
      this.props.navigateToRoute(this.props.routing);
    }

    // HOME - Listen to routing updates
    this.subscriptions.push(
      subscribe('routing', state => {
        if (state.routing.screen) {
          this.props.navigateToRoute(state.routing);
        }
      })
    );

    // FEED - Listen to feed specific posts
    // this.subscriptions.push(
    //   await this.props.loadPosts(this.props.auth.user.uid, 'feed')
    // );
    await this.props.loadUsersPosts(this.props.auth.user.uid, 'all');
    await this.props.loadUsersPosts(this.props.auth.user.uid, 'adds');
  }

  componentWillUnmount() {
    Object.values(this.subscriptions).forEach(unsubscribe => {
      unsubscribe();
    });
  }

  renderItem = item => {
    const routeURL = buildAppLink('shayr', 'shayr', 'PostDetail', {
      id: item.postId
    });

    return (
      <ContentCard
        payload={item}
        friends={{
          ...this.props.users.self,
          ...this.props.users.friends
        }}
        onTap={() => this.props.handleURLRoute(routeURL)}
        shareAction={{
          actionCount: item.shareCount,
          actionUser: item.shares
            ? item.shares.includes(this.props.auth.user.uid)
            : false,
          onPress: () =>
            this.props.postAction(
              'share',
              this.props.auth.user.uid,
              item.postId
            )
        }}
        addAction={{
          actionCount: item.addCount,
          actionUser: item.adds
            ? item.adds.includes(this.props.auth.user.uid)
            : false,
          onPress: () =>
            this.props.postAction('add', this.props.auth.user.uid, item.postId)
        }}
        doneAction={{
          actionCount: item.doneCount,
          actionUser: item.dones
            ? item.dones.includes(this.props.auth.user.uid)
            : false,
          onPress: () =>
            this.props.postAction('done', this.props.auth.user.uid, item.postId)
        }}
        likeAction={{
          actionCount: item.likeCount,
          actionUser: item.likes
            ? item.likes.includes(this.props.auth.user.uid)
            : false,
          onPress: () =>
            this.props.postAction('like', this.props.auth.user.uid, item.postId)
        }}
      />
    );
  };

  paginate = () => {
    // const unsubscribe = this.props.paginatePosts(
    //   this.props.auth.user.uid,
    //   'feed',
    //   this.props.posts.feedLastPost
    // );
    // if (unsubscribe) {
    //   this.subscriptions.push(unsubscribe);
    // }
  };

  refresh = () => {
    // const unsubscribe = this.props.refreshPosts(
    //   this.props.auth.user.uid,
    //   'feed'
    // );
    // if (unsubscribe) {
    //   this.subscriptions.push(unsubscribe);
    // }
  };

  loading = () => {
    if (
      !this.props.posts.feedPosts ||
      !this.props.users.friends ||
      !this.props.users.self
    ) {
      return <Text>LOADING</Text>;
    }
    return (
      <List
        data={flattenPosts(this.props.posts.feedPosts)}
        renderItem={item => this.renderItem(item)}
        onEndReached={() => this.paginate()}
        onRefresh={() => this.refresh()}
        refreshing={this.props.posts.refreshing}
      />
    );
  };

  signOut = () => {
    this.props.startSignOut();
    this.props.navigation.navigate('Login');
  };

  render() {
    // console.log(this.state);
    // console.log(this.props);

    return (
      <View style={styles.screen}>
        <Header
          backgroundColor={colors.YELLOW}
          statusBarStyle='dark-content'
          shadow
          title='Discover'
        />
        <View style={styles.container}>
          <this.loading />
        </View>
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Discover);
