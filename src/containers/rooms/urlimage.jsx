import React, { Component } from 'react';
import { render } from 'react-dom';
import { Stage, Layer, Image } from 'react-konva';
import useImage from 'use-image';

class URLImage extends React.Component {
    state = {
      image: null
    };
    componentDidMount() {
      this.loadImage();
    }
    componentDidUpdate(oldProps) {
      if (oldProps.src !== this.props.src) {
        this.loadImage();
      }
      if (oldProps.width !== this.props.width) {
        this.loadImage();
      }
      if (oldProps.height !== this.props.height) {
        this.loadImage();
      }
      //console.log(this.props)
    }
    componentWillUnmount() {
      this.image.removeEventListener('load', this.handleLoad);
    }
    loadImage() {
      // save to "this" to remove "load" handler on unmount
      this.image = new window.Image();
      this.image.src = this.props.src;
      this.image.crossOrigin = 'anonymous';
      this.image.addEventListener('load', this.handleLoad);
    }
    handleLoad = () => {
      // after setState react-konva will update canvas and redraw the layer
      // because "image" property is changed
      this.setState({
        image: this.image
      });
      // if you keep same image object during source updates
      // you will have to update layer manually:
      // this.imageNode.getLayer().batchDraw();
    };
    render() {
      return (
        <Image
          x={this.props.x}
          y={this.props.y}
          width={this.props.width}
          height={this.props.height}
          image={this.state.image}
          ref={node => {
            this.imageNode = node;
          }}
        />
      );
    }
  }

  export default URLImage;