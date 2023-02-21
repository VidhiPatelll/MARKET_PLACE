import { useContext, useEffect, useState } from "react";
import { Menu } from "antd";
import Link from "next/link";
import {
  AppstoreOutlined,
  CoffeeOutlined,
  LoginOutlined,
  LogoutOutlined,
  UserAddOutlined,
  CarryOutOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Context } from "../context";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

const { SubMenu, ItemGroup } = Menu;

const TopNav = () => {
  const [current, setCurrent] = useState("");

  const { state, dispatch } = useContext(Context);
  const { user } = state;

  const router = useRouter();

  useEffect(() => {
    // manage the path
    process.browser && setCurrent(window.location.pathname);
    // console.log(window.location.pathname);
  }, [process.browser && window.location.pathname]);

  const logout = async () => {
    dispatch({
      type: "LOGOUT",
    });
    window.localStorage.removeItem("user");
    const { data } = await axios.get("/api/logout");
    toast(data.message);
    router.push("/login");
  };

  const navStyle ={
    position : "fixed",
    marginBottom: "100px"
  }

  return (
    <Menu mode="horizontal" selectedKeys={[current]} className="mb-2 w-100" style={navStyle}>
      <Menu.Item
        key={"/"}
        onClick={(e) => setCurrent(e.key)}
        icon={<AppstoreOutlined />}
      >
        <Link legacyBehavior href="/">
          <span>App</span>
        </Link>
      </Menu.Item>

      {user && user.role && user.role.includes("Instructor") ? (
        <Menu.Item
          key={"/instructor/course/create"}
          onClick={(e) => setCurrent(e.key)}
          icon={<CarryOutOutlined />}
        >
          <Link legacyBehavior href="/instructor/course/create">
            <span>Create Course</span>
          </Link>
        </Menu.Item>
      ) : (
        <Menu.Item
          key={"/user/become-instructor"}
          onClick={(e) => setCurrent(e.key)}
          icon={<TeamOutlined />}
        >
          <Link legacyBehavior href="/user/become-instructor">
            <span>Become Instructor</span>
          </Link>
        </Menu.Item>
      )}

      {user === null && (
        <>
          <Menu.Item
            key={"/login"}
            onClick={(e) => setCurrent(e.key)}
            icon={<LoginOutlined />}
            style={{ float: "end" }}
          >
            <Link legacyBehavior href="/login">
              <span>Login</span>
            </Link>
          </Menu.Item>

          <Menu.Item
            key={"/register"}
            onClick={(e) => setCurrent(e.key)}
            icon={<UserAddOutlined />}
            style={{ float: "right" }}
          >
            <Link legacyBehavior href="/register">
              <span>Register</span>
            </Link>
          </Menu.Item>
        </>
      )}

      {user && user.role && user.role.includes("Instructor") && (
        <Menu.Item
          key={"/instructor"}
          onClick={(e) => setCurrent(e.key)}
          icon={<TeamOutlined />}
        >
          <Link legacyBehavior href="/instructor">
            <span>Instructor</span>
          </Link>
        </Menu.Item>
      )}

      {user !== null && (
        <SubMenu
          key={"submenu"}
          icon={<CoffeeOutlined />}
          title={user && user.name}
          style={{ float: "right" }}
        >
          <ItemGroup>
            <Menu.Item key={"/user"}>
              <Link legacyBehavior href="/user">
                <span>Dashboard</span>
              </Link>
            </Menu.Item>
            <Menu.Item key={"/logout"} onClick={logout}>
              Logout
            </Menu.Item>
          </ItemGroup>
        </SubMenu>
      )}
    </Menu>
  );
};

export default TopNav;
