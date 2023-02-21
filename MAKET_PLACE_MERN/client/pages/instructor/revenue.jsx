import { useState, useEffect, useContext } from "react";
import { Context } from "../../context";
import InstructorRoute from "../../components/routes/InstructorRoute";
import axios from "axios";
import {
  DollarOutlined,
  SettingOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { stripeCurrencyFormatter } from "../../utils/helpers";

const InstructorRevenue = () => {
  const [balance, setBalance] = useState({ pending: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    sendBalanceRequest();
  }, []);

  const sendBalanceRequest = async () => {
    const { data } = await axios.get("/api/instructor/balance");
    setBalance(data);
  };

  const handlePayoutSettings = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/instructor/payout-settings");
      window.location.href = data;
    } catch (err) {
      setLoading(false);
      console.log(err);
      alert("Unable to access payout settings. Try later.");
    }
  };

  return (
    <InstructorRoute>
      <div className="container">
        <div className="row pt-2">
          <div className="col-md-8 offset-md-2 bg-light p-5">
            <h2>
              Revenue report <DollarOutlined style={{ float: "right"}} className="mt-2" />{" "}
            </h2>
            <small>
              You get paid directly from stripe to your bank account every 48
              hour
            </small>
            <hr />
            {/* {JSON.stringify(balance, null, 4)} */}
            <h4>
              Pending balance
              {balance.pending &&
                balance.pending.map((bp, i) => (
                  <span key={i} style={{ float: "right"}} className="mt-2">
                    {stripeCurrencyFormatter(bp)}
                  </span>
                ))}
            </h4>
            <small>For last 48 hours</small>
            <hr />
            <h4>
              Payouts{" "}
              {!loading ? (
                <SettingOutlined
                style={{ float: "right"}}
                  className="mt-2 pointer"
                  onClick={handlePayoutSettings}
                />
              ) : (
                <SyncOutlined spin  style={{ float: "right"}} className="mt-2 pointer" />
              )}
            </h4>
            <small>
              Update your stripe account details or view previous payouts.
            </small>
          </div>
        </div>
      </div>
    </InstructorRoute>
  );
};

export default InstructorRevenue;