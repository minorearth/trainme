import React from "react";
import styled from "styled-components";
import { useRouter } from "next/navigation";
import { signOut } from "@/auth/services/servicesAuth";
import { RiLogoutCircleRLine } from "react-icons/ri";

const LogoutBtn = () => {
  const router = useRouter();
  return (
    <StyledWrapper>
      <button
        className="Btn"
        onClick={async () => {
          await signOut(router);
        }}
      >
        <div className="sign">
          <RiLogoutCircleRLine size="large" />
        </div>
        <div className="text">Logout</div>
      </button>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .Btn {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 50px;
    height: 50px;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition-duration: 0.4s;
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2);
    background: linear-gradient(
      135deg,
      rgb(10, 11, 11) 0%,
      rgb(8, 226, 96) 100%
    );
  }

  .sign {
    width: 100%;
    transition-duration: 0.4s;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .sign svg {
    width: 17px;
  }

  .sign svg path {
    fill: white;
  }

  .text {
    position: absolute;
    right: 0%;
    width: 0%;
    opacity: 0;
    color: #ecf0f1;
    font-size: 1.2em;
    font-weight: 600;
    transition-duration: 0.4s;
  }

  .Btn:hover {
    width: 150px;
    border-radius: 20px;
    transition-duration: 0.4s;
    background: linear-gradient(
      135deg,
      rgb(10, 11, 11) 0%,
      rgb(8, 226, 96) 100%
    );
  }

  .Btn:hover .sign {
    width: 30%;
    transition-duration: 0.4s;
    padding-left: 12px;
  }

  .Btn:hover .text {
    opacity: 1;
    width: 70%;
    transition-duration: 0.4s;
    padding-right: 10px;
  }

  .Btn:active {
    transform: translate(2px, 2px);
    box-shadow: 0 0 0 rgba(0, 0, 0, 0.2);
  }
`;

export default LogoutBtn;
