

import React from 'react';
import debounce from "lodash.debounce";
import throttle from "lodash.throttle";
import PropTypes from 'prop-types';
import './styles.css';



export default class Magnifier extends React.PureComponent {

	state = {
		showZoom: false,
		mgOffsetX: 0,
		mgOffsetY: 0,
		relX: 0,
		relY: 0,
	}


	constructor(props) {
		super(props);

		this.onMouseMove = throttle(this.onMouseMove.bind(this), 20, { trailing: false });
		this.onTouchMove = throttle(this.onTouchMove.bind(this), 20, { trailing: false });
		this.calcImgBounds = this.calcImgBounds.bind(this)
		this.onMouseEnter = this.onMouseEnter.bind(this)


		this.onMouseMove = this.onMouseMove.bind(this)
		this.onMouseOut = this.onMouseOut.bind(this)
		this.onTouchStart = this.onTouchStart.bind(this)
		this.onTouchMove = this.onTouchMove.bind(this)
		this.onTouchEnd = this.onTouchEnd.bind(this)

		this.calcImgBoundsDebounced = debounce(this.calcImgBounds, 200);
	}

	componentDidMount() {
		// Add mouse/touch event listeners to image element (assigned in render function)
		// `passive: false` prevents scrolling on touch move
		this.img.addEventListener("mouseenter", this.onMouseEnter, { passive: false });
		this.img.addEventListener("mousemove", this.onMouseMove, { passive: false });
		this.img.addEventListener("mouseout", this.onMouseOut, { passive: false });
		this.img.addEventListener("touchstart", this.onTouchStart, { passive: false });
		this.img.addEventListener("touchmove", this.onTouchMove, { passive: false });
		this.img.addEventListener("touchend", this.onTouchEnd, { passive: false });

		// Re-calculate image bounds on window resize
		window.addEventListener("resize", this.calcImgBoundsDebounced);
		// Re-calculate image bounds on scroll (useCapture: catch scroll events in entire DOM)
		window.addEventListener("scroll", this.calcImgBoundsDebounced, true);
	};

	componentWillUnmount() {
		// Remove all event listeners
		this.img.removeEventListener("mouseenter", this.onMouseEnter);
		this.img.removeEventListener("mousemove", this.onMouseMove);
		this.img.removeEventListener("mouseout", this.onMouseOut);
		this.img.removeEventListener("touchstart", this.onTouchStart);
		this.img.removeEventListener("touchmove", this.onTouchMove);
		this.img.removeEventListener("touchend", this.onTouchEnd);
		window.removeEventListener("resize", this.calcImgBoundsDebounced);
		window.removeEventListener("scroll", this.calcImgBoundsDebounced, true);
	};

	onMouseEnter() {
		this.calcImgBounds();
	};

	onMouseMove(e) {
		const { mgMouseOffsetX, mgMouseOffsetY } = this.props;

		if (this.imgBounds) {
			const target = e.target;
			const relX = (e.clientX - this.imgBounds.left) / target.clientWidth;
			const relY = (e.clientY - this.imgBounds.top) / target.clientHeight;

			this.setState({
				mgOffsetX: mgMouseOffsetX,
				mgOffsetY: mgMouseOffsetY,
				relX,
				relY,
				showZoom: true,
			});
		}
	};

	onMouseOut() {
		this.setState({ showZoom: false });
	};

	onTouchStart(e) {
		e.preventDefault(); // Prevent mouse event from being fired

		this.calcImgBounds();
	};

	onTouchMove(e) {
		e.preventDefault(); // Disable scroll on touch

		if (this.imgBounds) {
			const target = e.target;
			const { mgTouchOffsetX, mgTouchOffsetY } = this.props;
			const relX = (target.clientWidth - this.imgBounds.left) / target.clientWidth;
			const relY = (target.clientWidth - this.imgBounds.top) / target.clientHeight;

			// Only show magnifying glass if touch is inside image
			if (relX >= 0 && relY >= 0 && relX <= 1 && relY <= 1) {
				this.setState({
					mgOffsetX: mgTouchOffsetX,
					mgOffsetY: mgTouchOffsetY,
					relX,
					relY,
					showZoom: true,
				});
			} else {
				this.setState({
					showZoom: false,
				});
			}
		}
	};

	onTouchEnd() {
		this.setState({
			showZoom: false,
		});
	};

	calcImgBounds() {
		if (this.img) {
			this.imgBounds = this.img.getBoundingClientRect();
		}
	};

	render() {
		/* eslint-disable @typescript-eslint/no-unused-vars */
		const {
			src,
			width,
			height,
			className,
			zoomImgSrc,
			zoomFactor,
			mgHeight,
			mgWidth,
			mgBorderWidth,
			mgMouseOffsetX,
			mgMouseOffsetY,
			mgTouchOffsetX,
			mgTouchOffsetY,
			mgShape,
			mgShowOverflow,
			...otherProps
		} = this.props;
		/* eslint-enable @typescript-eslint/no-unused-vars */
		const { mgOffsetX, mgOffsetY, relX, relY, showZoom } = this.state;

		// Show/hide magnifying glass (opacity needed for transition)
		let mgClasses = "magnifying-glass";
		if (showZoom) {
			mgClasses += " visible";
		}
		if (mgShape === "circle") {
			mgClasses += " circle";
		}

		return (
			<div
				className={`magnifier ${className}`}
				style={{
					margin: '0 auto',
					textAlign: 'center',
					overflow: mgShowOverflow ? "visible" : "hidden",
				}}
			>
				{/* eslint-disable-next-line jsx-a11y/alt-text */}
				<img
					className="magnifier-image"
					src={src}

					height="100%"
					{...otherProps}
					onLoad={() => this.calcImgBounds.bind(this)}
					ref={(img) =>
						this.img = img}
				/>
				{this.imgBounds && (<>
					<div
						className={mgClasses}
						style={{
							width: mgWidth,
							height: mgHeight,
							left: `calc(${relX * 100}% - ${mgWidth / 2}px + ${mgOffsetX}px - ${mgBorderWidth}px)`,
							top: `calc(${relY * 100}% - ${mgHeight / 2}px + ${mgOffsetY}px - ${mgBorderWidth}px)`,
							backgroundImage: `url("${zoomImgSrc || src}")`,
							backgroundPosition: `calc(${relX * 100}% + ${mgWidth / 2}px - ${relX *
								mgWidth}px) calc(${relY * 100}% + ${mgHeight / 2}px - ${relY * mgWidth}px)`,
							backgroundSize: `${zoomFactor * this.imgBounds.width}% ${zoomFactor *
								this.imgBounds.height}%`,
							borderWidth: mgBorderWidth,
						}}
					/>
					<div style={{ position: 'absolute', color: '#9e9e9e', top: '13px', right: '15px' }}>Press <kbd>Esc</kbd> to exit</div></>
				)}
			</div>
		);
	};
}


Magnifier.defaultProps = {
	// Image		
	className: "",

	// Zoom image
	zoomImgSrc: "",
	zoomFactor: 1.5,

	// Magnifying glass
	mgWidth: 150,
	mgHeight: 150,
	mgBorderWidth: 2,
	mgShape: "circle",
	mgShowOverflow: true,
	mgMouseOffsetX: 0,
	mgMouseOffsetY: 0,
	mgTouchOffsetX: -50,
	mgTouchOffsetY: -50,
};
