import React from "react";
import Header from "./components/Header";
import UploadForm from "./components/UploadForm";
import RetrieveForm from "./components/RetrieveForm";

export default function App() {
  return (
    <>
      <Header />

      <div className="container px-4 pb-5">
        <div className="row g-4">
          <div className="col-lg-6">
            <UploadForm />
          </div>
          <div className="col-lg-6">
            <RetrieveForm />
          </div>
        </div>
      </div>
    </>
  );
}
