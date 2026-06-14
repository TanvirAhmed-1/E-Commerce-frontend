import React from "react";

const Container = ({ children }: { children: React.ReactNode }) => {
  return <div className="px-4 mx-auto container xl:max-w-350 ">{children}</div>;
};

export default Container;
