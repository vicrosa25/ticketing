import { useRef } from "react";
import LeftArrow from "../public/static/left.svg";
import RightArrow from "../public/static/right.svg";
import styled from "styled-components";

export default function Slider({ slides, speed = "500" }) {
  const slideshow = useRef(null);

  const next = () => {
    if (slideshow.current.children.length > 0) {
      const firstSlide = slideshow.current.children[0];
      slideshow.current.style.transition = `${speed}ms ease-out all`;

      const slideSize = slideshow.current.children[0].offsetWidth;

      slideshow.current.style.transform = `translateX(-${slideSize}px)`;

      const transition = () => {
        slideshow.current.style.transition = "none";
        slideshow.current.style.transform = `translateX(0)`;
        slideshow.current.appendChild(firstSlide);
        slideshow.current.removeEventListener("transitionend", transition);
      };

      slideshow.current.addEventListener("transitionend", transition);
    }
  };

  const previous = () => {
    if (slideshow.current.children.length > 0) {
      // Obtenemos el ultimo elemento del slideshow.
      const index = slideshow.current.children.length - 1;
      const ultimoElemento = slideshow.current.children[index];
      slideshow.current.insertBefore(
        ultimoElemento,
        slideshow.current.firstChild
      );

      slideshow.current.style.transition = "none";
      const tamañoSlide = slideshow.current.children[0].offsetWidth;
      slideshow.current.style.transform = `translateX(-${tamañoSlide}px)`;

      setTimeout(() => {
        slideshow.current.style.transition = `${speed}ms ease-out all`;
        slideshow.current.style.transform = `translateX(0)`;
      }, 30);
    }
  };

  const photos = slides.map((slide) => (
    <Slide key={slide}>
      <img key={slide} src={slide} alt="" />
    </Slide>
  ));

  return (
    <MainContainer>
      <SlideShow ref={slideshow}>{photos}</SlideShow>
      {slides.length > 1 && (
        <Controlls>
          <Button onClick={previous}>
            <LeftArrow />
          </Button>
          <Button right onClick={next}>
            <RightArrow />
          </Button>
        </Controlls>
      )}
    </MainContainer>
  );
}

const MainContainer = styled.div`
  position: relative;
  overflow: hidden;
`;

const SlideShow = styled.div`
  display: flex;
  flex-wrap: nowrap;
`;

const Slide = styled.div`
  min-width: 100%;
  overflow: hidden;
  transition: 3s ease all;
  z-index: 10;
  /* max-height: 1000px; */
  position: relative;

  img {
    width: 100%;
    vertical-align: top;
  }
`;

const Controlls = styled.div`
  position: absolute;
  top: 0;
  z-index: 20;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

const Button = styled.button`
  pointer-events: all;
  background: none;
  border: none;
  cursor: pointer;
  outline: none;
  width: 50px;
  height: 100%;
  text-align: center;
  position: absolute;
  transition: 0.3s ease all;
  &:hover {
    background: rgba(0, 0, 0, 0.2);
    path {
      fill: #fff;
    }
  }

  path {
    filter: ${(props) =>
      props.right
        ? "drop-shadow(-2px 0px 0px #fff)"
        : "drop-shadow(2px 0px 0px #fff)"};
  }

  ${(props) => (props.right ? "right: 0" : "left: 0")}
`;
