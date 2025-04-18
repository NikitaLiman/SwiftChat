import React from "react";
import EditDrawerBlock from "./editdrawer-block";
import { instanseAxios } from "../../../servises/instance";

interface Props {
  active: boolean;
  close: () => void;
  session: any;
}

const EditDrawer: React.FC<Props> = ({ active, close, session }) => {
  const [user, setUser] = React.useState<any>(null);
  const getUser = async () => {
    try {
      const res = await instanseAxios.get(`/user?email=${session.user.email}`);
      const data = await res.data;
      setUser(data);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };
  React.useEffect(() => {
    if (session?.user?.email) {
      getUser();
    }
  }, [session]);

  return (
    <>
      <EditDrawerBlock user={user} active={active} close={close} />
    </>
  );
};

export default EditDrawer;
