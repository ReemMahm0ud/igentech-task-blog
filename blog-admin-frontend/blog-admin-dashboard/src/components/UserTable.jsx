// import { useSelector } from "react-redux";
import { useState } from "react";
import {
  useGetUsersQuery,
  useDeleteUserMutation,
} from "../redux/API/UsersApiSlice";
import { toast } from "react-toastify";
import { Modal } from "./Modal";
import { useUpdateUserMutation } from "../redux/API/UsersApiSlice";
// import { useNavigate } from "react-router-dom";

export const UserTable = () => {
  //   const { token } = useSelector((state) => state.authSlice);
  const token = sessionStorage.getItem("token");
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState();
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [phone, setPhone] = useState();
  const [avatar, setAvatar] = useState();
  const {
    data: users,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetUsersQuery(token);
  const [deleteUser] = useDeleteUserMutation();
  const [updateUser] = useUpdateUserMutation();

  const updateModal = (user) => {
    setSelectedUser(user);
    setEmail(user.email);
    setName(user.name);
    setPhone(user.phone);
    setShowModal(true);
  };

  const handleDelete = async (e, id) => {
    // e.preventDefault();
    await deleteUser({ token, id })
      .unwrap()
      .then((fulfilled) => {
        if (fulfilled) {
          console.log(fulfilled);
          refetch();
          toast("user deleted successfully");
        }
      })
      .catch((rejected) => {
        console.error(rejected);
        toast.error(rejected?.data?.message || "Error occurred", {});
      });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const payload = new FormData();

    if (name !== selectedUser.name) {
      payload.append("name", name);
    }

    if (phone !== selectedUser.phone) {
      payload.append("phone", phone);
    }

    if (email !== selectedUser.email) {
      payload.append("email", email);
    }
    payload.append("avatar", avatar);

    // const payload = {
    //   name,
    //   phone,
    //   email,
    //   avatar,
    // };
    // console.log(payload);
    for (var pair of payload.entries()) {
      console.log(pair[0] + ", " + pair[1]);
    }

    await updateUser({ token, id: selectedUser.id, payload })
      .unwrap()
      .then((fulfilled) => {
        if (fulfilled) {
          console.log(fulfilled);
          setShowModal(false);
          refetch();
          toast("user updated successfully");
        }
      })
      .catch((rejected) => {
        console.error(rejected);
        toast.error(rejected?.data?.message || "Error occurred", {});
      });
  };

  if (isLoading) {
    return <div>loading...</div>;
  }
  if (isFetching) {
    return <div>fetching...</div>;
  }
  if (isError) {
    return <div>error...</div>;
  }
  return (
    <>
      <div className="antialiased font-sans ">
        <div className="container mx-auto px-4 sm:px-8">
          <div className="py-8">
            <div>
              <h2 className="text-2xl font-semibold leading-tight">Users</h2>
            </div>
            <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
              <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
                <table className="min-w-full leading-normal">
                  <thead>
                    <tr>
                      <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        name
                      </th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        phone
                      </th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        email
                      </th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users?.users?.map((user, index) => (
                      <tr key={index}>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 w-10 h-10">
                              <img
                                className="w-full h-full rounded-full"
                                src={user.media[0].original_url}
                                alt=""
                              />
                            </div>
                            <div className="ml-3">
                              <p className="text-gray-900 whitespace-no-wrap">
                                {user.name}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <p className="text-gray-900 whitespace-no-wrap">
                            {user.role === 1 ? "admin" : "author"}
                          </p>
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <p className="text-gray-900 whitespace-no-wrap">
                            {user.phone}
                          </p>
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <p className="text-gray-900 whitespace-no-wrap">
                            {user.email}
                          </p>
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <span className=" flex gap-4 relative inline-block px-3 py-1 font-semibold  leading-tight">
                            <button
                              onClick={() => updateModal(user)}
                              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 border border-blue-500 rounded"
                            >
                              update
                            </button>
                            <button
                              onClick={(e) => handleDelete(e, user.id)}
                              className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 border border-red-500 rounded"
                            >
                              delete
                            </button>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {/* <div className="px-5 py-5 bg-white border-t flex flex-col xs:flex-row items-center xs:justify-between          ">
                <span className="text-xs xs:text-sm text-gray-900">
                  Showing 1 to 4 of 50 Entries
                </span>
                <div className="inline-flex mt-2 xs:mt-0">
                  <button className="text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-l">
                    Prev
                  </button>
                  <button className="text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-r">
                    Next
                  </button>
                </div>
              </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
      {showModal && selectedUser ? (
        <Modal open={showModal} onClose={() => setShowModal(false)}>
          <div className="flex flex-col gap-4">
            <div className="lg:col-span-2">
              <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5">
                <div className="md:col-span-5">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="md:col-span-5">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="md:col-span-5">
                  <label htmlFor="phone">phone</label>
                  <input
                    type="text"
                    name="phone"
                    id="phone"
                    className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className="md:col-span-5">
                  <label htmlFor="avatar">avatar</label>
                  <input
                    type="file"
                    name="avatar"
                    id="avatar"
                    className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                    onChange={(e) => setAvatar(e.target.files[0])}
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <button
                onClick={(e) => handleUpdate(e)}
                className="flex gap-2 items-center justify-center py-2 px-4 font-semibold shadow-md rounded-lg text-white bg-green-600 shadow-green-400/10 w-full"
              >
                Continue
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex gap-2 items-center justify-center py-2 px-4 font-semibold shadow-md rounded-lg bg-white text-gray-500 w-full"
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      ) : null}
    </>
  );
};
