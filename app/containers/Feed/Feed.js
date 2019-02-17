import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styles from './styles';
import DynamicActionButton from '../../components/DynamicActionButton';
import List from '../../components/List';
import ContentCard from '../../components/ContentCard';
import {
  loadPosts,
  paginatePosts,
  refreshPosts,
  flattenPosts,
} from '../../redux/posts/PostsActions';
import { postAction } from '../../redux/postActions/PostActionsActions';
import { postDetailView } from '../PostDetail/actions';
import Header from '../../components/Header';
import colors from '../../styles/Colors';

const mapStateToProps = state => ({
  appListeners: state.appListeners,
  posts: state.posts,
});

const mapDispatchToProps = dispatch => ({
  postDetailView: post => dispatch(postDetailView(post)),
  loadPosts: (userId, query) => dispatch(loadPosts(userId, query)),
  paginatePosts: (userId, query, lastPost) => dispatch(paginatePosts(userId, query, lastPost)),
  refreshPosts: (userId, query) => dispatch(refreshPosts(userId, query)),
  postAction: (actionType, userId, postId) => dispatch(postAction(actionType, userId, postId)),
});

class Feed extends Component {
  static propTypes = {
    appListeners: PropTypes.instanceOf(Object).isRequired,
    navigation: PropTypes.instanceOf(Object).isRequired,
    posts: PropTypes.instanceOf(Object).isRequired,
  };

  static navigationOptions = ({ navigation }) => ({
    header: (
      <Header backgroundColor={colors.YELLOW} statusBarStyle="dark-content" shadow title="feed" />
    ),
  });

  constructor() {
    super();
    this.subscriptions = [];
  }

  componentDidMount() {
    this.subscriptions.push(this.props.loadPosts(this.props.appListeners.user.uid, 'feed'));
  }

  componentWillUnmount() {
    Object.values(this.subscriptions).forEach((subscription) => {
      subscription();
    });
  }

  renderItem = item => (
    <ContentCard
      payload={item}
      friends={{
        ...this.props.appListeners.self,
        ...this.props.appListeners.friends,
      }}
      // onTap={() => openURL(item.url)}
      onTap={() => this.props.postDetailView(item)}
      shareAction={{
        actionCount: item.shareCount,
        actionUser: item.shares ? item.shares.includes(this.props.appListeners.user.uid) : false,
        onPress: () => this.props.postAction('share', this.props.appListeners.user.uid, item.postId),
      }}
      addAction={{
        actionCount: item.addCount,
        actionUser: item.adds ? item.adds.includes(this.props.appListeners.user.uid) : false,
        onPress: () => this.props.postAction('add', this.props.appListeners.user.uid, item.postId),
      }}
      doneAction={{
        actionCount: item.doneCount,
        actionUser: item.dones ? item.dones.includes(this.props.appListeners.user.uid) : false,
        onPress: () => this.props.postAction('done', this.props.appListeners.user.uid, item.postId),
      }}
      likeAction={{
        actionCount: item.likeCount,
        actionUser: item.likes ? item.likes.includes(this.props.appListeners.user.uid) : false,
        onPress: () => this.props.postAction('like', this.props.appListeners.user.uid, item.postId),
      }}
    />
  );

  _paginate = () => {
    const unsubscribe = this.props.paginatePosts(
      this.props.appListeners.user.uid,
      'feed',
      this.props.posts.feedLastPost,
    );
    if (unsubscribe) {
      this.subscriptions.push(unsubscribe);
    }
  };

  _refresh = () => {
    const unsubscribe = this.props.refreshPosts(this.props.appListeners.user.uid, 'feed');
    if (unsubscribe) {
      this.subscriptions.push(unsubscribe);
    }
  };

  loading = () => {
    if (
      !this.props.posts.feedPosts
      || !this.props.appListeners.friends
      || !this.props.appListeners.self
    ) {
      return <Text>LOADING</Text>;
    }
    return (
      <List
        data={flattenPosts(this.props.posts.feedPosts)}
        renderItem={item => this.renderItem(item)}
        onEndReached={() => this._paginate()}
        onRefresh={() => this._refresh()}
        refreshing={this.props.posts.refreshing}
      />
    );
  };

  _signOut = () => {
    this.props.navigation.navigate('Auth');
  };

  render() {
    console.log(this.state);
    console.log(this.props);

    return (
      <View style={styles.container}>
        <this.loading />
        <DynamicActionButton logout={this._signOut} feed={false} />
      </View>
    );
  }
  // render() {
  //   return (
  //     <View style={styles.container}>
  //       <this.loading />
  //       <DynamicActionButton
  //         logout={this._signOut}
  //         feed={false}
  //         queue={this.props.navigation.navigate('Queue')}
  //       />
  //     </View>
  //   );
  // }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Feed);
