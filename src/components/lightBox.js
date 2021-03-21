import React, { Component } from "react";
import ReactDOM from "react-dom";
import { List, WindowScroller, AutoSizer } from "react-virtualized";
import "react-virtualized/styles.css"; // only needs to be imported once
import { connect } from "react-redux";
import {
  fetchDateAlbumsPhotoHashList,
  fetchAlbumsDateGalleries
} from "../actions/albumsActions";
import { copyToClipboard } from "../util/util";
import {
  fetchPhotoDetail,
  setPhotosFavorite,
  setPhotosHidden,
  setPhotosPublic,
  generatePhotoIm2txtCaption, generatePhotoPicCaption, generateBoundingBoxImage
} from "../actions/photosActions";
import {
  Card,
  Image,
  Header,
  Divider,
  Item,
  Loader,
  Dimmer,
  Form,
  Modal,
  Sticky,
  Portal,
  Grid,
  List as ListSUI,
  Container,
  Label,
  Popup,
  Segment,
  Button,
  Input,
  Icon,
  Table,
  Transition,
  Breadcrumb,
  Dropdown, ItemDescription
} from "semantic-ui-react";
import { Server, serverAddress, shareAddress } from "../api_client/apiClient";
import LazyLoad from "react-lazyload";
import Lightbox from "react-image-lightbox";
import { LocationMap } from "../components/maps";
import { push } from "react-router-redux";
import { searchPhotos } from "../actions/searchActions";
import styles from "../App.css";
import Draggable from "react-draggable";
import debounce from "lodash/debounce";
import * as moment from "moment";
import { Link } from "react-router-dom";

var topMenuHeight = 55; // don't change this
var leftMenuWidth = 85; // don't change this
var SIDEBAR_WIDTH = 85;
var timelineScrollWidth = 0;
var DAY_HEADER_HEIGHT = 35;

if (window.innerWidth < 600) {
  var LIGHTBOX_SIDEBAR_WIDTH = window.innerWidth;
} else {
  var LIGHTBOX_SIDEBAR_WIDTH = 360;
}
const personalityTraits = [{
  key: 'Abrasive',
  value: 'Abrasive',
  text: 'Abrasive'
}, {
  key: 'Absentminded',
  value: 'Absentminded',
  text: 'Absentminded'
}, {
  key: 'Adventurous',
  value: 'Adventurous',
  text: 'Adventurous'
}, {
  key: 'Aggressive',
  value: 'Aggressive',
  text: 'Aggressive'
}, {
  key: 'Airy',
  value: 'Airy',
  text: 'Airy'
}, {
  key: 'Aloof',
  value: 'Aloof',
  text: 'Aloof'
}, {
  key: 'Amusing',
  value: 'Amusing',
  text: 'Amusing'
}, {
  key: 'Angry',
  value: 'Angry',
  text: 'Angry'
}, {
  key: 'Anxious',
  value: 'Anxious',
  text: 'Anxious'
}, {
  key: 'Apathetic',
  value: 'Apathetic',
  text: 'Apathetic'
}, {
  key: 'Appreciative',
  value: 'Appreciative',
  text: 'Appreciative'
}, {
  key: 'Argumentative',
  value: 'Argumentative',
  text: 'Argumentative'
}, {
  key: 'Arrogant',
  value: 'Arrogant',
  text: 'Arrogant'
}, {
  key: 'Artful',
  value: 'Artful',
  text: 'Artful'
}, {
  key: 'Articulate',
  value: 'Articulate',
  text: 'Articulate'
}, {
  key: 'Artificial',
  value: 'Artificial',
  text: 'Artificial'
}, {
  key: 'Assertive',
  value: 'Assertive',
  text: 'Assertive'
}, {
  key: 'Attractive',
  value: 'Attractive',
  text: 'Attractive'
}, {
  key: 'Barbaric',
  value: 'Barbaric',
  text: 'Barbaric'
}, {
  key: 'Bewildered',
  value: 'Bewildered',
  text: 'Bewildered'
}, {
  key: 'Bizarre',
  value: 'Bizarre',
  text: 'Bizarre'
}, {
  key: 'Bland',
  value: 'Bland',
  text: 'Bland'
}, {
  key: 'Blunt',
  value: 'Blunt',
  text: 'Blunt'
}, {
  key: 'Boisterous',
  value: 'Boisterous',
  text: 'Boisterous'
}, {
  key: 'Boyish',
  value: 'Boyish',
  text: 'Boyish'
}, {
  key: 'Breezy',
  value: 'Breezy',
  text: 'Breezy'
}, {
  key: 'Brilliant',
  value: 'Brilliant',
  text: 'Brilliant'
}, {
  key: 'Businesslike',
  value: 'Businesslike',
  text: 'Businesslike'
}, {
  key: 'Calm',
  value: 'Calm',
  text: 'Calm'
}, {
  key: 'Captivating',
  value: 'Captivating',
  text: 'Captivating'
}, {
  key: 'Caring',
  value: 'Caring',
  text: 'Caring'
}, {
  key: 'Casual',
  value: 'Casual',
  text: 'Casual'
}, {
  key: 'Cerebral',
  value: 'Cerebral',
  text: 'Cerebral'
}, {
  key: 'Charming',
  value: 'Charming',
  text: 'Charming'
}, {
  key: 'Cheerful',
  value: 'Cheerful',
  text: 'Cheerful'
}, {
  key: 'Childish',
  value: 'Childish',
  text: 'Childish'
}, {
  key: 'Clever',
  value: 'Clever',
  text: 'Clever'
}, {
  key: 'Coarse',
  value: 'Coarse',
  text: 'Coarse'
}, {
  key: 'Cold',
  value: 'Cold',
  text: 'Cold'
}, {
  key: 'Colorful',
  value: 'Colorful',
  text: 'Colorful'
}, {
  key: 'Compassionate',
  value: 'Compassionate',
  text: 'Compassionate'
}, {
  key: 'Complex',
  value: 'Complex',
  text: 'Complex'
}, {
  key: 'Conceited',
  value: 'Conceited',
  text: 'Conceited'
}, {
  key: 'Confident',
  value: 'Confident',
  text: 'Confident'
}, {
  key: 'Confused',
  value: 'Confused',
  text: 'Confused'
}, {
  key: 'Conservative',
  value: 'Conservative',
  text: 'Conservative'
}, {
  key: 'Considerate',
  value: 'Considerate',
  text: 'Considerate'
}, {
  key: 'Contemplative',
  value: 'Contemplative',
  text: 'Contemplative'
}, {
  key: 'Contemptible',
  value: 'Contemptible',
  text: 'Contemptible'
}, {
  key: 'Contradictory',
  value: 'Contradictory',
  text: 'Contradictory'
}, {
  key: 'Courageous',
  value: 'Courageous',
  text: 'Courageous'
}, {
  key: 'Cowardly',
  value: 'Cowardly',
  text: 'Cowardly'
}, {
  key: 'Crazy',
  value: 'Crazy',
  text: 'Crazy'
}, {
  key: 'Creative',
  value: 'Creative',
  text: 'Creative'
}, {
  key: 'Critical',
  value: 'Critical',
  text: 'Critical'
}, {
  key: 'Cruel',
  value: 'Cruel',
  text: 'Cruel'
}, {
  key: 'Cultured',
  value: 'Cultured',
  text: 'Cultured'
}, {
  key: 'Curious',
  value: 'Curious',
  text: 'Curious'
}, {
  key: 'Cute',
  value: 'Cute',
  text: 'Cute'
}, {
  key: 'Cynical',
  value: 'Cynical',
  text: 'Cynical'
}, {
  key: 'Daring',
  value: 'Daring',
  text: 'Daring'
}, {
  key: 'Deep',
  value: 'Deep',
  text: 'Deep'
}, {
  key: 'Descriptive',
  value: 'Descriptive',
  text: 'Descriptive'
}, {
  key: 'Destructive',
  value: 'Destructive',
  text: 'Destructive'
}, {
  key: 'Devious',
  value: 'Devious',
  text: 'Devious'
}, {
  key: 'Discouraging',
  value: 'Discouraging',
  text: 'Discouraging'
}, {
  key: 'Disturbing',
  value: 'Disturbing',
  text: 'Disturbing'
}, {
  key: 'Dramatic',
  value: 'Dramatic',
  text: 'Dramatic'
}, {
  key: 'Dreamy',
  value: 'Dreamy',
  text: 'Dreamy'
}, {
  key: 'Dry',
  value: 'Dry',
  text: 'Dry'
}, {
  key: 'Dull',
  value: 'Dull',
  text: 'Dull'
}, {
  key: 'Earnest',
  value: 'Earnest',
  text: 'Earnest'
}, {
  key: 'Egocentric',
  value: 'Egocentric',
  text: 'Egocentric'
}, {
  key: 'Elegant',
  value: 'Elegant',
  text: 'Elegant'
}, {
  key: 'Eloquent',
  value: 'Eloquent',
  text: 'Eloquent'
}, {
  key: 'Emotional',
  value: 'Emotional',
  text: 'Emotional'
}, {
  key: 'Empathetic',
  value: 'Empathetic',
  text: 'Empathetic'
}, {
  key: 'Energetic',
  value: 'Energetic',
  text: 'Energetic'
}, {
  key: 'Enigmatic',
  value: 'Enigmatic',
  text: 'Enigmatic'
}, {
  key: 'Enthusiastic',
  value: 'Enthusiastic',
  text: 'Enthusiastic'
}, {
  key: 'Envious',
  value: 'Envious',
  text: 'Envious'
}, {
  key: 'Erratic',
  value: 'Erratic',
  text: 'Erratic'
}, {
  key: 'Escapist',
  value: 'Escapist',
  text: 'Escapist'
}, {
  key: 'Excitable',
  value: 'Excitable',
  text: 'Excitable'
}, {
  key: 'Exciting',
  value: 'Exciting',
  text: 'Exciting'
}, {
  key: 'Extraordinary',
  value: 'Extraordinary',
  text: 'Extraordinary'
}, {
  key: 'Extravagant',
  value: 'Extravagant',
  text: 'Extravagant'
}, {
  key: 'Extreme',
  value: 'Extreme',
  text: 'Extreme'
}, {
  key: 'Fanatical',
  value: 'Fanatical',
  text: 'Fanatical'
}, {
  key: 'Fanciful',
  value: 'Fanciful',
  text: 'Fanciful'
}, {
  key: 'Fatalistic',
  value: 'Fatalistic',
  text: 'Fatalistic'
}, {
  key: 'Fawning',
  value: 'Fawning',
  text: 'Fawning'
}, {
  key: 'Fearful',
  value: 'Fearful',
  text: 'Fearful'
}, {
  key: 'Fickle',
  value: 'Fickle',
  text: 'Fickle'
}, {
  key: 'Fiery',
  value: 'Fiery',
  text: 'Fiery'
}, {
  key: 'Foolish',
  value: 'Foolish',
  text: 'Foolish'
}, {
  key: 'Formal',
  value: 'Formal',
  text: 'Formal'
}, {
  key: 'Freethinking',
  value: 'Freethinking',
  text: 'Freethinking'
}, {
  key: 'Frightening',
  value: 'Frightening',
  text: 'Frightening'
}, {
  key: 'Frivolous',
  value: 'Frivolous',
  text: 'Frivolous'
}, {
  key: 'Fun-loving',
  value: 'Fun-loving',
  text: 'Fun-loving'
}, {
  key: 'Gentle',
  value: 'Gentle',
  text: 'Gentle'
}, {
  key: 'Glamorous',
  value: 'Glamorous',
  text: 'Glamorous'
}, {
  key: 'Gloomy',
  value: 'Gloomy',
  text: 'Gloomy'
}, {
  key: 'Grand',
  value: 'Grand',
  text: 'Grand'
}, {
  key: 'Grim',
  value: 'Grim',
  text: 'Grim'
}, {
  key: 'Happy',
  value: 'Happy',
  text: 'Happy'
}, {
  key: 'Hateful',
  value: 'Hateful',
  text: 'Hateful'
}, {
  key: 'Haughty',
  value: 'Haughty',
  text: 'Haughty'
}, {
  key: 'High-spirited',
  value: 'High-spirited',
  text: 'High-spirited'
}, {
  key: 'Honest',
  value: 'Honest',
  text: 'Honest'
}, {
  key: 'Hostile',
  value: 'Hostile',
  text: 'Hostile'
}, {
  key: 'Humble',
  value: 'Humble',
  text: 'Humble'
}, {
  key: 'Humorous',
  value: 'Humorous',
  text: 'Humorous'
}, {
  key: 'Idealistic',
  value: 'Idealistic',
  text: 'Idealistic'
}, {
  key: 'Imaginative',
  value: 'Imaginative',
  text: 'Imaginative'
}, {
  key: 'Impersonal',
  value: 'Impersonal',
  text: 'Impersonal'
}, {
  key: 'Insightful',
  value: 'Insightful',
  text: 'Insightful'
}, {
  key: 'Intelligent',
  value: 'Intelligent',
  text: 'Intelligent'
}, {
  key: 'Intense',
  value: 'Intense',
  text: 'Intense'
}, {
  key: 'Irrational',
  value: 'Irrational',
  text: 'Irrational'
}, {
  key: 'Irritable',
  value: 'Irritable',
  text: 'Irritable'
}, {
  key: 'Kind',
  value: 'Kind',
  text: 'Kind'
}, {
  key: 'Knowledgeable',
  value: 'Knowledgeable',
  text: 'Knowledgeable'
}, {
  key: 'Lazy',
  value: 'Lazy',
  text: 'Lazy'
}, {
  key: 'Logical',
  value: 'Logical',
  text: 'Logical'
}, {
  key: 'Malicious',
  value: 'Malicious',
  text: 'Malicious'
}, {
  key: 'Maternal',
  value: 'Maternal',
  text: 'Maternal'
}, {
  key: 'Melancholic',
  value: 'Melancholic',
  text: 'Melancholic'
}, {
  key: 'Mellow',
  value: 'Mellow',
  text: 'Mellow'
}, {
  key: 'Meticulous',
  value: 'Meticulous',
  text: 'Meticulous'
}, {
  key: 'Miserable',
  value: 'Miserable',
  text: 'Miserable'
}, {
  key: 'Money-minded',
  value: 'Money-minded',
  text: 'Money-minded'
}, {
  key: 'Monstrous',
  value: 'Monstrous',
  text: 'Monstrous'
}, {
  key: 'Moody',
  value: 'Moody',
  text: 'Moody'
}, {
  key: 'Morbid',
  value: 'Morbid',
  text: 'Morbid'
}, {
  key: 'Mystical',
  value: 'Mystical',
  text: 'Mystical'
}, {
  key: 'Narcissistic',
  value: 'Narcissistic',
  text: 'Narcissistic'
}, {
  key: 'Neurotic',
  value: 'Neurotic',
  text: 'Neurotic'
}, {
  key: 'Neutral',
  value: 'Neutral',
  text: 'Neutral'
}, {
  key: 'Nihilistic',
  value: 'Nihilistic',
  text: 'Nihilistic'
}, {
  key: 'Objective',
  value: 'Objective',
  text: 'Objective'
}, {
  key: 'Obnoxious',
  value: 'Obnoxious',
  text: 'Obnoxious'
}, {
  key: 'Observant',
  value: 'Observant',
  text: 'Observant'
}, {
  key: 'Obsessive',
  value: 'Obsessive',
  text: 'Obsessive'
}, {
  key: 'Odd',
  value: 'Odd',
  text: 'Odd'
}, {
  key: 'Offhand',
  value: 'Offhand',
  text: 'Offhand'
}, {
  key: 'Old-fashioned',
  value: 'Old-fashioned',
  text: 'Old-fashioned'
}, {
  key: 'Open',
  value: 'Open',
  text: 'Open'
}, {
  key: 'Opinionated',
  value: 'Opinionated',
  text: 'Opinionated'
}, {
  key: 'Optimistic',
  value: 'Optimistic',
  text: 'Optimistic'
}, {
  key: 'Ordinary',
  value: 'Ordinary',
  text: 'Ordinary'
}, {
  key: 'Outrageous',
  value: 'Outrageous',
  text: 'Outrageous'
}, {
  key: 'Overimaginative',
  value: 'Overimaginative',
  text: 'Overimaginative'
}, {
  key: 'Paranoid',
  value: 'Paranoid',
  text: 'Paranoid'
}, {
  key: 'Passionate',
  value: 'Passionate',
  text: 'Passionate'
}, {
  key: 'Passive',
  value: 'Passive',
  text: 'Passive'
}, {
  key: 'Patriotic',
  value: 'Patriotic',
  text: 'Patriotic'
}, {
  key: 'Peaceful',
  value: 'Peaceful',
  text: 'Peaceful'
}, {
  key: 'Perceptive',
  value: 'Perceptive',
  text: 'Perceptive'
}, {
  key: 'Playful',
  value: 'Playful',
  text: 'Playful'
}, {
  key: 'Pompous',
  value: 'Pompous',
  text: 'Pompous'
}, {
  key: 'Practical',
  value: 'Practical',
  text: 'Practical'
}, {
  key: 'Pretentious',
  value: 'Pretentious',
  text: 'Pretentious'
}, {
  key: 'Profound',
  value: 'Profound',
  text: 'Profound'
}, {
  key: 'Provocative',
  value: 'Provocative',
  text: 'Provocative'
}, {
  key: 'Questioning',
  value: 'Questioning',
  text: 'Questioning'
}, {
  key: 'Quirky',
  value: 'Quirky',
  text: 'Quirky'
}, {
  key: 'Rational',
  value: 'Rational',
  text: 'Rational'
}, {
  key: 'Realistic',
  value: 'Realistic',
  text: 'Realistic'
}, {
  key: 'Reflective',
  value: 'Reflective',
  text: 'Reflective'
}, {
  key: 'Relaxed',
  value: 'Relaxed',
  text: 'Relaxed'
}, {
  key: 'Resentful',
  value: 'Resentful',
  text: 'Resentful'
}, {
  key: 'Respectful',
  value: 'Respectful',
  text: 'Respectful'
}, {
  key: 'Ridiculous',
  value: 'Ridiculous',
  text: 'Ridiculous'
}, {
  key: 'Rigid',
  value: 'Rigid',
  text: 'Rigid'
}, {
  key: 'Romantic',
  value: 'Romantic',
  text: 'Romantic'
}, {
  key: 'Rowdy',
  value: 'Rowdy',
  text: 'Rowdy'
}, {
  key: 'Rustic',
  value: 'Rustic',
  text: 'Rustic'
}, {
  key: 'Sarcastic',
  value: 'Sarcastic',
  text: 'Sarcastic'
}, {
  key: 'Scholarly',
  value: 'Scholarly',
  text: 'Scholarly'
}, {
  key: 'Scornful',
  value: 'Scornful',
  text: 'Scornful'
}, {
  key: 'Sensitive',
  value: 'Sensitive',
  text: 'Sensitive'
}, {
  key: 'Sensual',
  value: 'Sensual',
  text: 'Sensual'
}, {
  key: 'Sentimental',
  value: 'Sentimental',
  text: 'Sentimental'
}, {
  key: 'Serious',
  value: 'Serious',
  text: 'Serious'
}, {
  key: 'Shy',
  value: 'Shy',
  text: 'Shy'
}, {
  key: 'Silly',
  value: 'Silly',
  text: 'Silly'
}, {
  key: 'Simple',
  value: 'Simple',
  text: 'Simple'
}, {
  key: 'Skeptical',
  value: 'Skeptical',
  text: 'Skeptical'
}, {
  key: 'Solemn',
  value: 'Solemn',
  text: 'Solemn'
}, {
  key: 'Sophisticated',
  value: 'Sophisticated',
  text: 'Sophisticated'
}, {
  key: 'Spirited',
  value: 'Spirited',
  text: 'Spirited'
}, {
  key: 'Spontaneous',
  value: 'Spontaneous',
  text: 'Spontaneous'
}, {
  key: 'Stiff',
  value: 'Stiff',
  text: 'Stiff'
}, {
  key: 'Stoic',
  value: 'Stoic',
  text: 'Stoic'
}, {
  key: 'Stupid',
  value: 'Stupid',
  text: 'Stupid'
}, {
  key: 'Stylish',
  value: 'Stylish',
  text: 'Stylish'
}, {
  key: 'Suave',
  value: 'Suave',
  text: 'Suave'
}, {
  key: 'Sweet',
  value: 'Sweet',
  text: 'Sweet'
}, {
  key: 'Sympathetic',
  value: 'Sympathetic',
  text: 'Sympathetic'
}, {
  key: 'Tense',
  value: 'Tense',
  text: 'Tense'
}, {
  key: 'Tough',
  value: 'Tough',
  text: 'Tough'
}, {
  key: 'Uncreative',
  value: 'Uncreative',
  text: 'Uncreative'
}, {
  key: 'Unimaginative',
  value: 'Unimaginative',
  text: 'Unimaginative'
}, {
  key: 'Unrealistic',
  value: 'Unrealistic',
  text: 'Unrealistic'
}, {
  key: 'Vacuous',
  value: 'Vacuous',
  text: 'Vacuous'
}, {
  key: 'Vague',
  value: 'Vague',
  text: 'Vague'
}, {
  key: 'Vivacious',
  value: 'Vivacious',
  text: 'Vivacious'
}, {
  key: 'Warm',
  value: 'Warm',
  text: 'Warm'
}, {
  key: 'Whimsical',
  value: 'Whimsical',
  text: 'Whimsical'
}, {
  key: 'Wise',
  value: 'Wise',
  text: 'Wise'
}, {
  key: 'Wishful',
  value: 'Wishful',
  text: 'Wishful'
}, {
  key: 'Witty',
  value: 'Witty',
  text: 'Witty'
}, {
  key: 'Youthful',
  value: 'Youthful',
  text: 'Youthful'
}, {
  key: 'Zany',
  value: 'Zany',
  text: 'Zany'
}]

const colors = [
  "red",
  "orange",
  "yellow",
  "olive",
  "green",
  "teal",
  "blue",
  "violet",
  "purple",
  "pink",
  "brown",
  "grey",
  "black"
];

export class LightBox extends Component {
  state = {
    lightboxSidebarShow: false,
    showBoundingBoxes : false
  };

  updateBoundingBox() {
    console.log('bounding box callback')
    this.setState({
      showBoundingBoxes: !this.state.showBoundingBoxes
    })
    console.log(this.state)
  }

render() {
  let mainSrc;
  const authGetParams = !this.props.isPublic
      ? "?jwt=" + this.props.auth.access.token
      : "";
    if (
      !this.props.photoDetails[
        this.props.idx2hash.slice(this.props.lightboxImageIndex)[0]
      ]
    ) {
      console.log("light box has not gotten main photo detail");
      mainSrc = "/transparentbackground.png";
    } else {
      console.log("light box has got main photo detail");
      mainSrc = serverAddress +
          "/media/thumbnails_big/" +
          this.props.idx2hash.slice(this.props.lightboxImageIndex)[0] +
          ".jpg";
      if (
        this.props.photoDetails[
          this.props.idx2hash.slice(this.props.lightboxImageIndex)[0]
        ].hidden &&
        !this.props.showHidden
      ) {
        mainSrc = "/hidden.png"
      } else if (this.state.showBoundingBoxes){
        mainSrc = serverAddress +
            "/media/bounding_box_images/" +
            this.props.idx2hash.slice(this.props.lightboxImageIndex)[0] +
            ".jpg"
      }

      for (var i = 0; i < 10; i++) {
        setTimeout(() => {

          // Fix large wide images when side bar open; retry once per 250ms over 2.5 seconds
          if (document.getElementsByClassName('ril-image-current').length > 0) {
            this.state.wideImg = (document.getElementsByClassName('ril-image-current')[0].naturalWidth > window.innerWidth);

            // 360px side bar /2 = 180px to the left = re-centers a wide image
            var translate = (this.state.lightboxSidebarShow && this.state.wideImg) ? `-180px` : '';

            if (document.getElementsByClassName('ril-image-current')[0].style.left !== translate) {
              document.getElementsByClassName('ril-image-current')[0].style.left = translate;

              // Fix react-image-lightbox
              // It did not re-calculate the image_prev and image_next when pressed left or right arrow key
              // It only updated those offsets on render / scroll / double click to zoom / etc.
              this.forceUpdate();
            }

            // Since we disabled animations, we can set image_prev and image_next visibility hidden
            // Fixes prev/next large wide 16:9 images were visible at same time as main small 9:16 image in view
            document.getElementsByClassName('ril-image-prev')[0].style.visibility = 'hidden';
            document.getElementsByClassName('ril-image-next')[0].style.visibility = 'hidden';
            document.getElementsByClassName('ril-image-current')[0].style.visibility = 'visible';

            // Make toolbar background fully transparent
            if (document.getElementsByClassName('ril-toolbar').length > 0) {
              document.getElementsByClassName('ril-toolbar')[0].style.backgroundColor = 'rgba(0, 0, 0, 0)';
            }
          }
        }, 250*i);
      }
    }

    return (
      <div>
        <Lightbox
          animationDisabled={true}
          mainSrc={mainSrc}
          nextSrc={
            serverAddress +
            "/media/thumbnails_big/" +
            this.props.idx2hash.slice(
              (this.props.lightboxImageIndex + 1) % this.props.idx2hash.length
            )[0] +
            ".jpg"
          }
          prevSrc={
            serverAddress +
            "/media/thumbnails_big/" +
            this.props.idx2hash.slice(
              (this.props.lightboxImageIndex - 1) % this.props.idx2hash.length
            )[0] +
            ".jpg"
          }
          toolbarButtons={[
            <div>
              {!this.props.photoDetails[
                this.props.idx2hash[this.props.lightboxImageIndex]
              ] && (
                <Button
                  loading
                  color="black"
                  icon
                  circular
                  disabled={this.props.isPublic}
                >
                  <Icon name="hide" color={"grey"} />
                </Button>
              )}
              {!this.props.photoDetails[
                this.props.idx2hash[this.props.lightboxImageIndex]
              ] && (
                <Button
                  loading
                  color="black"
                  icon
                  circular
                  disabled={this.props.isPublic}
                >
                  <Icon name="star" color={"grey"} />
                </Button>
              )}
              {!this.props.photoDetails[
                this.props.idx2hash[this.props.lightboxImageIndex]
              ] && (
                <Button
                  loading
                  color="black"
                  icon
                  circular
                  disabled={this.props.isPublic}
                >
                  <Icon name="globe" color={"grey"} />
                </Button>
              )}
              {this.props.photoDetails[
                this.props.idx2hash[this.props.lightboxImageIndex]
              ] && (
                <Button
                  disabled={this.props.isPublic}
                  onClick={() => {
                    const image_hash = this.props.idx2hash[
                      this.props.lightboxImageIndex
                    ];
                    const val = !this.props.photoDetails[image_hash].hidden;
                    this.props.dispatch(setPhotosHidden([image_hash], val));
                  }}
                  color="black"
                  icon
                  circular
                >
                  <Icon
                    name="hide"
                    color={
                      this.props.photoDetails[
                        this.props.idx2hash[this.props.lightboxImageIndex]
                      ].hidden
                        ? "red"
                        : "grey"
                    }
                  />
                </Button>
              )}
              {this.props.photoDetails[
                this.props.idx2hash[this.props.lightboxImageIndex]
              ] && (
                <Button
                  disabled={this.props.isPublic}
                  onClick={() => {
                    const image_hash = this.props.idx2hash[
                      this.props.lightboxImageIndex
                    ];
                    const val = !this.props.photoDetails[image_hash].favorited;
                    this.props.dispatch(setPhotosFavorite([image_hash], val));
                  }}
                  color="black"
                  icon
                  circular
                >
                  <Icon
                    name="star"
                    color={
                      this.props.photoDetails[
                        this.props.idx2hash[this.props.lightboxImageIndex]
                      ].favorited
                        ? "yellow"
                        : "grey"
                    }
                  />
                </Button>
              )}
              {this.props.photoDetails[
                this.props.idx2hash[this.props.lightboxImageIndex]
              ] && (
                <Button
                  disabled={this.props.isPublic}
                  onClick={() => {
                    const image_hash = this.props.idx2hash[
                      this.props.lightboxImageIndex
                    ];
                    const val = !this.props.photoDetails[image_hash].public;
                    this.props.dispatch(setPhotosPublic([image_hash], val));
                    copyToClipboard(
                      //edited from serverAddress.replace('//','') + "/media/thumbnails_big/" + image_hash + ".jpg"
                      // as above removed the domain and just left /media/thumbnails_big/" + image_hash + ".jpg"  *DW 12/9/20
                      // Not location of shared photo link Reverted to orgiinal *DW 12/13/20
                      shareAddress + "/media/thumbnails_big/" + image_hash + ".jpg"
                    );
                  }}
                  color="black"
                  icon
                  circular
                >
                  <Icon
                    name="globe"
                    color={
                      this.props.photoDetails[
                        this.props.idx2hash[this.props.lightboxImageIndex]
                      ].public
                        ? "green"
                        : "grey"
                    }
                  />
                </Button>
              )}
              <Button
                  icon
                  circular
                  color={"black"}
                  onClick={() => {
                    this.props.dispatch(generateBoundingBoxImage(this.props.idx2hash[this.props.lightboxImageIndex],
                        this.updateBoundingBox.bind(this)))
                  }}
              >
                <Icon
                    name="id badge outline icon"
                    color={this.state.showBoundingBoxes ? "green" : "grey"}
                />
              </Button>
              <Button
                icon
                active={this.state.lightboxSidebarShow}
                circular
                onClick={() => {
                  this.setState({
                    lightboxSidebarShow: !this.state.lightboxSidebarShow
                  });
                }}
              >
                <Icon
                    name="info"
                />
              </Button>
            </div>
          ]}
          onCloseRequest={this.props.onCloseRequest}
          onAfterOpen={() => {
            console.log("lightbox trying to fetch photo detail");
            this.props.onImageLoad();
          }}
          onMovePrevRequest={this.props.onMovePrevRequest}
          onMoveNextRequest={this.props.onMoveNextRequest}
          sidebarWidth={
            this.state.lightboxSidebarShow ? LIGHTBOX_SIDEBAR_WIDTH : 0
          }
          reactModalStyle={{
            content: {
              // transform: this.state.lightboxSidebarShow ? `scale(0.5,1)` : ''
              // right: this.state.lightboxSidebarShow ? LIGHTBOX_SIDEBAR_WIDTH : 0,
              // width: this.state.lightboxSidebarShow ? window.innerWidth - LIGHTBOX_SIDEBAR_WIDTH : window.innerWidth,
            },
            overlay: {
              right: this.state.lightboxSidebarShow
                ? LIGHTBOX_SIDEBAR_WIDTH
                : 0,
              width: this.state.lightboxSidebarShow
                ? window.innerWidth - LIGHTBOX_SIDEBAR_WIDTH
                : window.innerWidth
            }
          }}
        />
        <Transition
          visible={this.state.lightboxSidebarShow}
          animation="fade left"
          duration={500}
        >
          <div
            style={{
              right: 0,
              top: 0,
              float: "right",
              backgroundColor: "white",
              width: LIGHTBOX_SIDEBAR_WIDTH,
              height: window.innerHeight,
              whiteSpace: "normal",
              position: "fixed",
              overflowY: "scroll",
              overflowX: "hidden",
              zIndex: 1000
            }}
          >
            {this.props.photoDetails.hasOwnProperty(
              this.props.idx2hash[this.props.lightboxImageIndex]
            ) && (
              <div style={{ width: LIGHTBOX_SIDEBAR_WIDTH }}>
                <div
                  style={{
                    paddingLeft: 30,
                    paddingRight: 30,
                    fontSize: "14px",
                    lineHeight: "normal",
                    whiteSpace: "normal",
                    wordWrap: "break-all"
                  }}
                >
                  <Button
                    floated="right"
                    circular
                    icon="close"
                    onClick={() => {
                      this.setState({ lightboxSidebarShow: false });
                      this.forceUpdate();
                    }}
                  />
                  <Header as="h3">Details</Header>

                  <Item.Group relaxed>

{/* Start Item Time Taken */}

                    <Item>
                      <Item.Content verticalAlign="middle">
                        <Item.Header>
                          <Icon name="calendar" /> Time Taken
                        </Item.Header>
                        <Item.Description>
                          {moment.utc(
                            this.props.photoDetails[
                              this.props.idx2hash[this.props.lightboxImageIndex]
                            ].exif_timestamp
                          ).format("dddd, MMMM Do YYYY, h:mm a")}
                        </Item.Description>
                      </Item.Content>
                    </Item>

{/* End Item Time Taken */}
{/* Start Item File Path */}

                    <Item>
                      <Item.Content verticalAlign="middle">
                        <Item.Header>
                          <Icon name="file" /> File Path
                        </Item.Header>
                        <Item.Description>
                          <Breadcrumb
                            as={Link}
                            to={serverAddress+'/media/photos/'+this.props.idx2hash[this.props.lightboxImageIndex]+'.jpg'}
                            target='_blank'
                            divider="/"
                            sections={this.props.photoDetails[
                              this.props.idx2hash[this.props.lightboxImageIndex]
                            ].image_path
                              .split("/")
                              .map(el => {
                                return { key: el, content: el };
                              })}
                          />
                        </Item.Description>
                      </Item.Content>
                    </Item>

{/* End Item File Path */}
{/* Start Item Location */}

                    {
                            this.props.photoDetails[
                              this.props.idx2hash[this.props.lightboxImageIndex]
                            ].search_location &&
                    (<Item>
                      <Item.Content verticalAlign="middle">
                        <Item.Header>
                          <Icon name="point" /> Location
                        </Item.Header>
                        <Item.Description>
                          {
                            this.props.photoDetails[
                              this.props.idx2hash[this.props.lightboxImageIndex]
                            ].search_location
                          }
                        </Item.Description>
                      </Item.Content>
                    </Item>)
                    }

                    <div
                      style={{
                        width: LIGHTBOX_SIDEBAR_WIDTH - 70,
                        whiteSpace: "normal",
                        lineHeight: "normal"
                      }}
                    >
                      {this.props.photoDetails[
                        this.props.idx2hash[this.props.lightboxImageIndex]
                      ].exif_gps_lat && (
                        <LocationMap
                          zoom={16}
                          photos={[
                            this.props.photoDetails[
                              this.props.idx2hash[this.props.lightboxImageIndex]
                            ]
                          ]}
                        />
                      )}
                    </div>

{/* End Item Location */}
{/* Start Item People */}

                    {
                            this.props.photoDetails[
                              this.props.idx2hash[this.props.lightboxImageIndex]
                            ].people.length > 0 &&
                    (<Item>
                      <Item.Content verticalAlign="middle">
                        <Item.Header>
                          <Icon name="users" /> People
                        </Item.Header>
                        <Item.Description>
                          <Label.Group>
                            {this.props.photoDetails[
                              this.props.idx2hash[this.props.lightboxImageIndex]
                            ].people.map((nc, idx) => (
                              <Label
                                color={
                                  colors[
                                    idx %
                                      this.props.photoDetails[
                                        this.props.idx2hash[
                                          this.props.lightboxImageIndex
                                        ]
                                      ].people.length
                                  ]
                                }
                                onClick={() => {
                                  this.props.dispatch(searchPhotos(nc));
                                  this.props.dispatch(push("/search"));
                                }}
                              >
                                <Icon name="user" />
                                {nc}
                              </Label>
                            ))}
                          </Label.Group>
                        </Item.Description>
                      </Item.Content>
                    </Item>)
                    }

{/* End Item People */}
{/* Start Item Caption */}

                    <Item>
                      <Item.Content verticalAlign="middle">
                        <Item.Header>
                          <Icon name="write" /> Caption
                        </Item.Header>
                        <Item.Description>
                          {false}
                          <PersonalityForm {...this.props}/>
                        </Item.Description>
                      </Item.Content>
                    </Item>


{/* End Item Caption */}
{/* Start Item Scene */}

                    <Item>
                      <Item.Content verticalAlign="middle">
                        <Item.Header>
                          <Icon name="tags" /> Scene
                        </Item.Header>
                        <Item.Description>
                          <p>
                            <b>Attributes</b>
                          </p>
                          <Label.Group>
                            {this.props.photoDetails[
                              this.props.idx2hash[this.props.lightboxImageIndex]
                            ].captions_json.places365.attributes.map(
                              (nc, idx) => (
                                <Label
                                  key={
                                    "lightbox_attribute_label_" +
                                    this.props.idx2hash[
                                      this.props.lightboxImageIndex
                                    ] +
                                    "_" +
                                    nc
                                  }
                                  tag
                                  color={
                                    colors[
                                      idx %
                                        this.props.photoDetails[
                                          this.props.idx2hash[
                                            this.props.lightboxImageIndex
                                          ]
                                        ].search_captions.split(" , ").length
                                    ]
                                  }
                                  color="blue"
                                  onClick={() => {
                                    this.props.dispatch(searchPhotos(nc));
                                    this.props.dispatch(push("/search"));
                                  }}
                                >
                                  {nc}
                                </Label>
                              )
                            )}
                          </Label.Group>
                          <p>
                            <b>Categories</b>
                          </p>
                          <Label.Group>
                            {this.props.photoDetails[
                              this.props.idx2hash[this.props.lightboxImageIndex]
                            ].captions_json.places365.categories.map(
                              (nc, idx) => (
                                <Label
                                  key={
                                    "lightbox_category_label_" +
                                    this.props.idx2hash[
                                      this.props.lightboxImageIndex
                                    ] +
                                    "_" +
                                    nc
                                  }
                                  tag
                                  color={
                                    colors[
                                      idx %
                                        this.props.photoDetails[
                                          this.props.idx2hash[
                                            this.props.lightboxImageIndex
                                          ]
                                        ].search_captions.split(" , ").length
                                    ]
                                  }
                                  color="teal"
                                  onClick={() => {
                                    this.props.dispatch(searchPhotos(nc));
                                    this.props.dispatch(push("/search"));
                                  }}
                                >
                                  {nc}
                                </Label>
                              )
                            )}
                          </Label.Group>
                        </Item.Description>
                      </Item.Content>
                    </Item>

{/* End Item Scene */}
{/* Start Item Similar Photos */}

                    <Item>
                      <Item.Content verticalAlign="middle">
                        <Item.Header>
                          <Icon name="images"/>Similar Photos
                        </Item.Header>
                        <Item.Description>
                          <Image.Group>
                          {
                                this.props.photoDetails[
                                  this.props.idx2hash[
                                    this.props.lightboxImageIndex
                                  ]
                                ].similar_photos.slice(0,30).map(el=>(
                                  <Image width={95} height={95}
                                    src={serverAddress+"/media/square_thumbnails_small/"+el.image_hash+".jpg"}/>
                                ))
                          }
                          </Image.Group>
                        </Item.Description>
                      </Item.Content>
                    </Item>

{/* End Item Similar Photos */}

                  </Item.Group>
                </div>
              </div>
            )}
          </div>
        </Transition>
      </div>
    );
  }
}

LightBox = connect(store => {
  return {
    auth: store.auth,
    photoDetails: store.photos.photoDetails,
    fetchingPhotoDetail: store.photos.fetchingPhotoDetail,
    fetchedPhotoDetail: store.photos.fetchedPhotoDetail,
    generatingCaptionIm2txt: store.photos.generatingCaptionIm2txt,
    photos: store.photos.photos
  };
})(LightBox);


class PersonalityForm extends Component{
  constructor(props) {
    super(props);
    console.log(props)
    const pic = this.props.photoDetails[
          this.props.idx2hash[
              this.props.lightboxImageIndex
              ]
          ].captions_json.pic
    this.state = {caption : pic.caption, personality: pic.personality}
    this.updateCaption = this.updateCaption.bind(this)
  }

  updateCaption(imageHash, data) {
    console.log(imageHash, "captions_json", data)
    console.log(this.state.personality)
    console.log(this.state.caption)
    this.setState({caption: data.caption})
    console.log(this.state.caption)
    this.forceUpdate()
  }

  render(){
    return(
        <div>
          <Dropdown
              placeholder={"Personality Trait"}
              name={"personality"}
              search
              selection
              options={personalityTraits}
              defaultValue={this.state.personality}
              onChange={
                (event, data)=>{
                  this.setState({
                    [data.name] : data.value
                  })
                }
              }
          />
          <Form>
            <Form.TextArea
                disabled={this.props.isPublic}
                fluid
                placeholder={""}
                value={this.state.caption}
            />
            <Button
                loading={this.props.generatingCaptionIm2txt}
                onClick={()=>{
                  this.props.dispatch(
                      generatePhotoPicCaption(
                          this.props.idx2hash[this.props.lightboxImageIndex],
                          this.state.personality,
                          this.updateCaption,
                      ))}}
                disabled={this.props.isPublic | this.props.generatingCaptionIm2txt}
                floated="left"
                size="small"
                color="blue"
            >
              Generate
            </Button>
          </Form>

        </div>
    )
  }
}