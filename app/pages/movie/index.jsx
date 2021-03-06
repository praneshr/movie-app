import React, { Component } from 'react'
import ReactCSS from 'react-css-modules'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import ImageProgressive from 'react-progressive-bg-image'
import globalStyles from 'global-styles'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import { uiStates, uiActions } from '../../redux-connect'
import { imageBase } from '../../APIs/config/'
import styles from './styles'
import Details from '../../components/details'
import DetailsSkeleton from '../../components/details-skeleton'


@connect(uiStates, uiActions)
@withStyles(styles)
@ReactCSS({ ...globalStyles, ...styles }, { allowMultiple: true })
class Movie extends Component {

  constructor() {
    super()
    this.state = {
      mounted: false,
    }
  }

  fetchData(props) {
    const {
      params: {
        id,
      },
      ui: {
        movies,
      },
    } = props
    if (!movies[id]) {
      props.actions.getMovie(id, {
        append_to_response: 'releases,images,videos,credits,similar,reviews',
      })
      .then(({ data }) => {
        props.actions.movies({
          [id]: data,
        })
      })
    }

  }

  componentDidMount() {
    this.setState({
      mounted: true,
    })
    this.fetchData(this.props)
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.params.id !== nextProps.params.id) {
      this.fetchData(nextProps)
    }
  }


  getleftPane(movieDetails) {
    return <div>
      <ImageProgressive
        className={styles['poster-img']}
        placeholder={`${imageBase}/w92${movieDetails.poster_path}`}
        src={`${imageBase}/w500${movieDetails.poster_path}`}
      />
    </div>
  }

  render() {
    const {
      params: {
        id,
      },
      ui: {
        movies,
      },
    } = this.props
    const movieDetails = movies[id]
    return (
      <div styleName="movie-detail">
        {
          movieDetails
          && <Helmet title={`${movieDetails.title} - The Movie and TV`}>
            <meta name="description" content={movieDetails.overview} />
            <meta content={`${imageBase}/w500${movieDetails.poster_path}`} property="og:image" />
            <meta content="The Movie and TV" property="og:site_name" />
            <meta content="object" property="og:type" />
            <meta content={movieDetails.title} property="og:title" />
            <meta content={`https://themovientv.com/movies/${id}`} property="og:url" />
            <meta content={movieDetails.overview} property="og:description" />

            <meta name="twitter:card" value="summary_large_image" />
            <meta name="twitter:site" value="@pranesh_ravi" />
            <meta name="twitter:creator" value="@pranesh_ravi" />
            <meta name="twitter:title" content={movieDetails.title} />
            <meta name="twitter:description" content={movieDetails.overview} />
            <meta name="twitter:image" content={`${imageBase}/w500${movieDetails.poster_path}`} />
            <meta name="twitter:label1" content="Rating" />
            <meta name="twitter:value1" content={`${movieDetails.vote_average.toFixed(1)}/10`} />
            <meta name="twitter:label2" content="Year" />
            <meta name="twitter:value2" content={`${movieDetails.release_date.split('-')[0]}`} />
          </Helmet>
        }
        <div styleName="banner">
          {
            movieDetails
            && this.state.mounted
            && <ImageProgressive
              className={styles['movie-banner']}
              placeholder={`${imageBase}/w45${movieDetails.backdrop_path}`}
              src={`${imageBase}/${window.innerWidth < 800 ? 'w780' : 'original'}${movieDetails.backdrop_path}`}
            />
          }
          <div styleName="fade-out" />
        </div>
        <div styleName="container">
          <div styleName="row content">
            <div styleName="col-md-4 col-xs-8">
              <div styleName="poster">
                {
                  (movieDetails && this.state.mounted)
                  ? this.getleftPane(movieDetails)
                  : <div styleName="skeleton-placeholder poster-img placeholder" />
                }
              </div>
            </div>
            <div styleName="col-md-8 col-xs-12">
              {
                movieDetails
                  ? <Details data={movieDetails} />
                  : <DetailsSkeleton />
              }
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Movie
