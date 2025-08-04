import Layout from "../components/global/layout";

const Html = ({ handleSubmit, back, category, handleToggle }) => {
  return (
    <>
      <Layout
        handleKeyPress={""}
        setFilter={""}
        reset={""}
        filter={""}
        name="Email Notification Settings"
        filters={""}
      >
        <form onSubmit={handleSubmit}>
          <div className="pprofile1 mt-3">
            <div className="d-flex align-items-center add_memeber_bx">
              <button
                type="button"
                onClick={(e) => back()}
                className="btn btn-link text-decoration-none   p-0"
              >
                <i
                  className="fa fa-arrow-left left_arrows"
                  title="Back"
                  aria-hidden="true"
                ></i>
              </button>
              <h3 className="Profilehedding add_title ms-2">
                Email Notification Settings 
              </h3>
            </div>

            <div className="add_team_bx">
              <div className="form-row">
                <div className="col-md-12 mb-3">
                  {
                    <div className="row">
                      {category?.map((item, index) => (
                        <div
                          key={item.id || index}
                          className="col-sm-6 col-md-6 col-lg-4 col-xl-3 mb-2  gap-3 align-items-center"
                        >
                          <label className="mb-0 d-flex gap-3 align-items-center">
                            <div
                              onClick={() => handleToggle(index)}
                              className={`toggle-btn ${
                                item.isChecked ? "checked" : ""
                              }`}
                              role="button"
                              aria-pressed={item.isChecked || false}
                            >
                              <div className="toggle-btn-inner"></div>
                            </div>
                            {item?.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>
        </form>
      </Layout>
    </>
  );
};

export default Html;
