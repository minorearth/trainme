import React from "react";
import styled from "styled-components";

interface cardProps {
  title: string;
  text: string;
  onClick: () => void;
}

const Card = ({ title, text, onClick }: cardProps) => {
  return (
    <StyledWrapper>
      <div
        className="parent"
        onClick={() => {
          onClick();
        }}
      >
        <div className="card">
          <div className="logo">
            <span className="circle circle1" />
            <span className="circle circle2" />
            <span className="circle circle3" />
            <span className="circle circle4" />
            <span className="circle circle5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 29.667 31.69"
                className="svg"
              >
                <path
                  id="Path_6"
                  data-name="Path 6"
                  d="M12.827,1.628A1.561,1.561,0,0,1,14.31,0h2.964a1.561,1.561,0,0,1,1.483,1.628v11.9a9.252,9.252,0,0,1-2.432,6.852q-2.432,2.409-6.963,2.409T2.4,20.452Q0,18.094,0,13.669V1.628A1.561,1.561,0,0,1,1.483,0h2.98A1.561,1.561,0,0,1,5.947,1.628V13.191a5.635,5.635,0,0,0,.85,3.451,3.153,3.153,0,0,0,2.632,1.094,3.032,3.032,0,0,0,2.582-1.076,5.836,5.836,0,0,0,.816-3.486Z"
                  transform="translate(0 0)"
                />
                <path
                  id="Path_7"
                  data-name="Path 7"
                  d="M75.207,20.857a1.561,1.561,0,0,1-1.483,1.628h-2.98a1.561,1.561,0,0,1-1.483-1.628V1.628A1.561,1.561,0,0,1,70.743,0h2.98a1.561,1.561,0,0,1,1.483,1.628Z"
                  transform="translate(-45.91 0)"
                />
                <path
                  id="Path_8"
                  data-name="Path 8"
                  d="M0,80.018A1.561,1.561,0,0,1,1.483,78.39h26.7a1.561,1.561,0,0,1,1.483,1.628v2.006a1.561,1.561,0,0,1-1.483,1.628H1.483A1.561,1.561,0,0,1,0,82.025Z"
                  transform="translate(0 -51.963)"
                />
              </svg>
            </span>
          </div>
          <div className="glass" />
          <div className="content">
            <span className="title">{title}</span>
            <span className="text">{text}</span>
          </div>
          <div className="bottom">
            <div className="social-buttons-container">
              <button className="social-button .social-button1"></button>
              <button className="social-button .social-button2"></button>
              <button className="social-button .social-button3"></button>
            </div>
            <div className="view-more">
              {/* <button className="view-more-button">View more</button> */}
              {/* {lock ? <LockOpenIcon /> : <LockIcon />} */}

              {/* <svg
                className="svg"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m6 9 6 6 6-6" />
              </svg> */}
            </div>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  /* #e92a67 0deg,
      #a853ba 120deg,
      #2a8af6 240deg,
      #2a8af600 360deg
       --node-box-shadow: 10px 0 15px rgba(42, 138, 246, 0.3),
    -10px 0 15px rgba(233, 42, 103, 0.3); */

  /* title */
  --color1: rgba(18, 33, 130);
  /* unused */
  --color2: #e92a67;
  /* description */
  --color3: rgba(18, 33, 130, 0.7);
  /* rounds background */
  --color4: rgba(18, 33, 130, 0.5);
  /* card shadow */
  --color5: rgba(5, 71, 17, 0);
  --color6: rgba(18, 33, 130, 0.2);
  /* Background Gradient */
  --color8: rgb(255, 46, 112);
  --color7: rgb(18, 33, 130);
  /* --color7: rgb(10, 11, 11); */
  /* --color8: #2a8af6; */
  /* logo background */
  --color9: rgba(32, 12, 18, 0.1);

  /* --color1: #00894d;
  --color2: #00c37b;
  --color3: rgba(0, 137, 78, 0.7647058824);
  --color4: rgba(5, 71, 17, 0.5);
  --color5: rgba(5, 71, 17, 0);
  --color6: rgba(5, 71, 17, 0.2);
  --color7: rgb(10, 11, 11);
  --color8: rgb(8, 226, 96);
  --color9: rgba(0, 249, 203, 0.1); */

  .parent {
    width: 340px;
    height: 350px;
    perspective: 1000px;
    cursor: pointer;
  }

  .card {
    height: 100%;
    border-radius: 50px;
    background: linear-gradient(135deg, var(--color7) 0%, var(--color8) 100%);
    transition: all 0.5s ease-in-out;
    transform-style: preserve-3d;
    box-shadow: var(--color5) 40px 50px 25px -40px,
      var(--color6) 0px 25px 25px -5px;
  }

  .glass {
    transform-style: preserve-3d;
    position: absolute;
    inset: 8px;
    border-radius: 55px;
    border-top-right-radius: 100%;
    background: linear-gradient(
      0deg,
      rgba(255, 255, 255, 0.349) 0%,
      rgba(255, 255, 255, 0.815) 100%
    );
    /* -webkit-backdrop-filter: blur(5px);
    backdrop-filter: blur(5px); */
    transform: translate3d(0px, 0px, 25px);
    border-left: 1px solid white;
    border-bottom: 1px solid white;
    transition: all 0.5s ease-in-out;
  }

  .content {
    padding: 100px 60px 0px 30px;
    transform: translate3d(0, 0, 26px);
  }

  .content .title {
    display: block;
    color: var(--color1);
    font-weight: 900;
    font-size: 20px;
  }

  .content .text {
    display: block;
    color: var(--color3);
    font-size: 15px;
    margin-top: 20px;
  }

  .bottom {
    padding: 10px 12px;
    transform-style: preserve-3d;
    position: absolute;
    bottom: 20px;
    left: 20px;
    right: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    transform: translate3d(0, 0, 26px);
  }

  .bottom .view-more {
    display: flex;
    align-items: center;
    width: 40%;
    justify-content: flex-end;
    transition: all 0.2s ease-in-out;
  }

  .bottom .view-more:hover {
    transform: translate3d(0, 0, 10px);
  }

  .bottom .view-more .view-more-button {
    background: none;
    border: none;
    color: var(--color2);
    font-weight: bolder;
    font-size: 12px;
  }

  .bottom .view-more .svg {
    fill: none;
    stroke: var(--color2);
    stroke-width: 3px;
    max-height: 15px;
  }

  .bottom .social-buttons-container {
    display: flex;
    gap: 10px;
    transform-style: preserve-3d;
  }

  .bottom .social-buttons-container .social-button {
    width: 30px;
    aspect-ratio: 1;
    padding: 5px;
    background: rgb(255, 255, 255);
    border-radius: 50%;
    border: none;
    display: grid;
    place-content: center;
    box-shadow: var(--color4) 0px 7px 5px -5px;
  }

  .bottom .social-buttons-container .social-button:first-child {
    transition: transform 0.2s ease-in-out 0.4s,
      box-shadow 0.2s ease-in-out 0.4s;
  }

  .bottom .social-buttons-container .social-button:nth-child(2) {
    transition: transform 0.2s ease-in-out 0.6s,
      box-shadow 0.2s ease-in-out 0.6s;
  }

  .bottom .social-buttons-container .social-button:nth-child(3) {
    transition: transform 0.2s ease-in-out 0.8s,
      box-shadow 0.2s ease-in-out 0.8s;
  }

  .bottom .social-buttons-container .social-button .svg {
    width: 15px;
    fill: var(--color1);
  }

  .bottom .social-buttons-container .social-button:hover {
    /* background: black; */
  }

  .bottom .social-buttons-container .social-button:hover .svg {
    fill: white;
  }

  /* .bottom .social-buttons-container .social-button:active {
    background: rgb(255, 234, 0);
  } */

  /* .bottom .social-buttons-container .social-button:active .svg {
    fill: black;
  } */

  .logo {
    position: absolute;
    right: 0;
    top: 0;
    transform-style: preserve-3d;
  }

  .logo .circle {
    display: block;
    position: absolute;
    aspect-ratio: 1;
    border-radius: 50%;
    top: 0;
    right: 0;
    box-shadow: rgba(100, 100, 111, 0.2) -10px 10px 20px 0px;
    -webkit-backdrop-filter: blur(5px);
    backdrop-filter: blur(0px);
    background: var(--color9);
    transition: all 0.5s ease-in-out;
  }

  .logo .circle1 {
    width: 170px;
    transform: translate3d(0, 0, 20px);
    top: 8px;
    right: 8px;
  }

  .logo .circle2 {
    width: 140px;
    transform: translate3d(0, 0, 40px);
    top: 10px;
    right: 10px;
    -webkit-backdrop-filter: blur(1px);
    backdrop-filter: blur(1px);
    transition-delay: 0.4s;
  }

  .logo .circle3 {
    width: 110px;
    transform: translate3d(0, 0, 60px);
    top: 17px;
    right: 17px;
    transition-delay: 0.8s;
  }

  .logo .circle4 {
    width: 80px;
    transform: translate3d(0, 0, 80px);
    top: 23px;
    right: 23px;
    transition-delay: 1.2s;
  }

  .logo .circle5 {
    width: 50px;
    transform: translate3d(0, 0, 100px);
    top: 30px;
    right: 30px;
    display: grid;
    place-content: center;
    transition-delay: 1.6s;
  }

  .logo .circle5 .svg {
    width: 20px;
    fill: white;
  }

  .parent:hover .card {
    transform: rotate3d(1, 1, 0, 30deg);
    box-shadow: rgba(5, 71, 17, 0.3) 30px 50px 25px -40px,
      rgba(5, 71, 17, 0.1) 0px 25px 30px 0px;
  }

  .parent:hover .card .bottom .social-buttons-container .social-button {
    transform: translate3d(0, 0, 50px);
    box-shadow: rgba(5, 71, 17, 0.2) -5px 20px 10px 0px;
  }

  .parent:hover .card .logo .circle2 {
    transform: translate3d(0, 0, 60px);
  }

  .parent:hover .card .logo .circle3 {
    transform: translate3d(0, 0, 80px);
  }

  .parent:hover .card .logo .circle4 {
    transform: translate3d(0, 0, 100px);
  }

  .parent:hover .card .logo .circle5 {
    transform: translate3d(0, 0, 120px);
  }
`;

export default Card;
