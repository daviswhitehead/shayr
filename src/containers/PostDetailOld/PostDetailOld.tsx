import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { withNavigationFocus } from 'react-navigation';
import { connect } from 'react-redux';
import Header from '../../components/Header';
import PostAction from '../../components/PostAction';
import PostContext from '../../components/PostContext';
import PostImage from '../../components/PostImage';
// import ProfileIcon from '../../components/ProfileIcon';
import FontBody from '../../components/Text/FontBody';
import { getProfile } from '../../lib/SocialConnectors';
import { openURL } from '../../lib/Utils';
import { postAction } from '../../redux/postActions/actions';
import { loadPostDetails, resetPostDetail } from '../../redux/posts/actions';
import colors from '../../styles/Colors';
import styles from './styles';

const mapStateToProps = state => ({
  auth: state.auth,
  posts: state.posts,
  users: state.users
});

const mapDispatchToProps = dispatch => ({
  loadPostDetails: (userId, postId) =>
    dispatch(loadPostDetails(userId, postId)),
  postAction: (actionType, userId, postId) =>
    dispatch(postAction(actionType, userId, postId)),
  resetPostDetail: () => dispatch(resetPostDetail())
});

class PostDetail extends Component {
  static propTypes = {
    auth: PropTypes.shape({
      user: PropTypes.shape({
        uid: PropTypes.string.isRequired
      }).isRequired
    }).isRequired,
    posts: PropTypes.shape({
      postDetailId: PropTypes.string.isRequired,
      postDetail: PropTypes.shape({})
    }).isRequired,
    users: PropTypes.shape({
      friends: PropTypes.shape({
        friendId: PropTypes.shape({
          firstName: PropTypes.string,
          lastName: PropTypes.string,
          facebookProfilePhoto: PropTypes.string
        })
      }).isRequired,
      self: PropTypes.shape({
        selfId: PropTypes.shape({
          firstName: PropTypes.string,
          lastName: PropTypes.string,
          facebookProfilePhoto: PropTypes.string
        })
      }).isRequired
    }).isRequired,
    loadPostDetails: PropTypes.func.isRequired,
    postAction: PropTypes.func.isRequired
  };

  constructor() {
    super();
    this.subscriptions = [];
  }

  async componentDidMount() {
    console.log(this.props);
    this.subscriptions.push(
      this.props.loadPostDetails(
        this.props.auth.user.uid,
        this.props.posts.postDetailId
      )
    );
  }

  componentWillUnmount() {
    Object.values(this.subscriptions).forEach(subscription => {
      subscription();
    });
    this.props.resetPostDetail();
  }

  collectFeaturedProfiles = (users, userIds) => {
    const profiles = [];
    Object.values(userIds).forEach(userId => {
      const profile = getProfile(users, userId);
      if (profile) {
        profiles.push(
          <ProfileIcon
            view='large'
            key={`${userId}`}
            uri={profile.facebookProfilePhoto}
            firstName={profile.firstName}
            lastName={profile.lastName}
          />
        );
      }
    });

    return profiles;
  };

  render() {
    if (!this.props.posts.postDetail) {
      return <View style={styles.container} />;
    }

    let post;
    Object.values(this.props.posts.postDetail).forEach(postData => {
      // there should only be one post here
      post = postData;
    });

    const sharedBy = this.collectFeaturedProfiles(
      { ...this.props.users.friends, ...this.props.users.self },
      post.shares || []
    );
    const addedBy = this.collectFeaturedProfiles(
      { ...this.props.users.friends, ...this.props.users.self },
      post.adds || []
    );
    const donedBy = this.collectFeaturedProfiles(
      { ...this.props.users.friends, ...this.props.users.self },
      post.dones || []
    );
    const likedBy = this.collectFeaturedProfiles(
      { ...this.props.users.friends, ...this.props.users.self },
      post.likes || []
    );

    return (
      <View style={styles.screen}>
        {this.props.isFocused ? (
          <Header
            backgroundColor={colors.WHITE}
            statusBarStyle='dark-content'
            title=''
            back={() => this.props.navigation.goBack()}
          />
        ) : null}
        <View style={styles.container}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <TouchableOpacity
              style={styles.contentBox}
              onPress={() => openURL(post.url)}
            >
              <PostImage view='detail' uri={post.image} />
              <PostContext
                title={post.title}
                publisher={post.publisher.name}
                actions={false}
              />
            </TouchableOpacity>
            <View style={styles.dividerBox}>
              <View style={styles.divider} />
              <View style={styles.actionBox}>
                <PostAction
                  actionType='share'
                  actionCount={post.shareCount}
                  actionUser={
                    post.shares
                      ? post.shares.includes(this.props.auth.user.uid)
                      : false
                  }
                  onPress={() =>
                    this.props.postAction(
                      'share',
                      this.props.auth.user.uid,
                      post.postId
                    )
                  }
                />
                <PostAction
                  actionType='add'
                  actionCount={post.addCount}
                  actionUser={
                    post.adds
                      ? post.adds.includes(this.props.auth.user.uid)
                      : false
                  }
                  onPress={() =>
                    this.props.postAction(
                      'add',
                      this.props.auth.user.uid,
                      post.postId
                    )
                  }
                />
                <PostAction
                  actionType='done'
                  actionCount={post.doneCount}
                  actionUser={
                    post.dones
                      ? post.dones.includes(this.props.auth.user.uid)
                      : false
                  }
                  onPress={() =>
                    this.props.postAction(
                      'done',
                      this.props.auth.user.uid,
                      post.postId
                    )
                  }
                />
                <PostAction
                  actionType='like'
                  actionCount={post.likeCount}
                  actionUser={
                    post.likes
                      ? post.likes.includes(this.props.auth.user.uid)
                      : false
                  }
                  onPress={() =>
                    this.props.postAction(
                      'like',
                      this.props.auth.user.uid,
                      post.postId
                    )
                  }
                />
              </View>
              <View style={styles.divider} />
            </View>
            <View style={styles.descriptionBox}>
              <Text style={styles.header}>Summary</Text>
              <FontBody text={post.description} />
            </View>
            {sharedBy.length > 0 ? (
              <View style={styles.actionByBox}>
                <Text style={styles.header}>shayred by</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {sharedBy}
                </ScrollView>
              </View>
            ) : (
              <View />
            )}
            {addedBy.length > 0 ? (
              <View style={styles.actionByBox}>
                <Text style={styles.header}>added by</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {addedBy}
                </ScrollView>
              </View>
            ) : (
              <View />
            )}
            {donedBy.length > 0 ? (
              <View style={styles.actionByBox}>
                <Text style={styles.header}>read by</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {donedBy}
                </ScrollView>
              </View>
            ) : (
              <View />
            )}
            {likedBy.length > 0 ? (
              <View style={styles.actionByBox}>
                <Text style={styles.header}>liked by</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {likedBy}
                </ScrollView>
              </View>
            ) : (
              <View />
            )}
          </ScrollView>
        </View>
      </View>
    );
  }
}

export default withNavigationFocus(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(PostDetail)
);