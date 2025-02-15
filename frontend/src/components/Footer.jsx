// import React from 'react'
import { VscGithubInverted } from "react-icons/vsc";

function Footer() {
  return (
    <footer>
      <div className="flex justify-center items-center mr-auto gap-x-2 font-semibold text-md sm:text-lg md:text-xl h-13">
        <VscGithubInverted className="text-2xl" />
        <h1 className="md:text-lg">
          <span>
            <a href="https://github.com/NewMissU" target="_blank">
              Github: NewMissU
            </a>
          </span>
        </h1>
      </div>
    </footer>
  );
}

export default Footer;
