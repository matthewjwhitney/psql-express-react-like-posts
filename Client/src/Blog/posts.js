import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Link } from 'react-router-dom';
import * as ACTIONS from '../store/actions/actions';
import axios from 'axios';

import Button from '@material-ui/core/Button';

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";

import Pagination from "react-js-pagination";

import '../App.css'





class Posts extends Component {
  constructor(props) {
      super(props)

    this.state = {
      posts: [],
      opacity: 0,
      posts_motion: [],
      num_posts: 0,
      page_range: 0,
      activePage: 1,
      posts_per_page: 5,
      posts_slice: [],
    }
  }

  componentDidMount() {
    this.handleTransition()
    axios.get('/api/get/allposts')
      .then(res => this.props.set_posts(res.data))
      .then(() => this.add_posts_to_state(this.props.posts))
      .catch((err) => console.log(err))
  }

  handleTransition = () => {
    setTimeout(() => this.setState({opacity: 1}), 400 )
  }

  add_posts_to_state = (posts) => {
    this.setState({posts: [...posts]})
    this.setState({num_posts: this.state.posts.length})
    this.setState({page_range: this.state.num_posts/5})

    this.slice_posts();
    this.animate_posts();
  }

  slice_posts = () => {
     const indexOfLastPost = this.state.activePage * this.state.posts_per_page
     const indexOfFirstPost = indexOfLastPost - this.state.posts_per_page


     this.setState({posts_slice: this.state.posts.slice(indexOfFirstPost, indexOfLastPost) })
   }

   animate_posts = () => {
      this.setState({posts_motion: [] })
      let i = 1
      this.state.posts_slice.map(post => {  // eslint-disable-line
        setTimeout(() => { this.setState({posts_motion: [...this.state.posts_motion, post]}) }, 400 * i );
        i++;
      })
    }

  handlePageChange = (pageNumber) => {
    this.setState({activePage: pageNumber});

    setTimeout(() => { this.slice_posts() }, 50 )
    setTimeout(() => { this.animate_posts() }, 100 )
   }

  RenderPosts = post => (
    <div className="CardStyles">
    <Card >
      <CardHeader
        title={<Link to={{pathname:'/post/' + post.post.pid, state: {post}}}>
                  {post.post.title}
                </Link> }
        subheader={
            <div className="FlexColumn">
              <div className="FlexRow">
                {post.post.date_created}
              </div>
              <div className="FlexRow">
                <i className="material-icons">thumb_up</i>
                <div className="notification-num-allposts"> {post.post.likes} </div>
              </div>
            </div>
            }
          />
      <br />
      <CardContent>
        <span style={{overflow: 'hidden' }}> {post.post.body} </span>
      </CardContent>
    </Card>
    </div>
  )

  render(){
    return(
        <div>
        <div style={{opacity: this.state.opacity, transition: 'opacity 2s ease'}}>
        <br />
        <Link to="/addpost">
          <Button variant="contained" color="primary">
            Add Post
          </Button>
        </Link>
        </div>

        <div style={{opacity: this.state.opacity, transition: 'opacity 2s ease'}}>
        <h1>Posts</h1>
          <div>
                {this.state.posts
                  ? this.state.posts_motion.map(post =>
                    <this.RenderPosts key={post.pid} post={post} />
                   )
                   : null
                 }
           </div>
         </div>
         <Pagination
             activePage={this.state.activePage}
             itemsCountPerPage={5}
             totalItemsCount={this.state.num_posts}
             pageRangeDisplayed={this.state.page_range}
             onChange={this.handlePageChange}
            />
        </div>
    )}
}


function mapStateToProps(state) {
  return {
    posts: state.posts_reducer.posts
  }
}

function mapDispatchToProps(dispatch) {
  return {
    set_posts: (posts) => dispatch(ACTIONS.fetch_db_posts(posts))
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(Posts)
