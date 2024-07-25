import { useState } from "react";
import {
  useDeletePostMutation,
  useGetPostsQuery,
  useUpdatePostMutation,
} from "../redux/API/PostsApiSlice";
import { toast } from "react-toastify";
import { Modal } from "./Modal";

export const PostTable = () => {
  const token = sessionStorage.getItem("token");
  const [showModal, setShowModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState();
  const [title, setTitle] = useState();
  const [description, setDescription] = useState();
  const [images, setImages] = useState([]);
  const {
    data: posts,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetPostsQuery(token);
  const [deletePost] = useDeletePostMutation();
  const [updatePost] = useUpdatePostMutation();

  const updateModal = (post) => {
    setSelectedPost(post);
    setTitle(post.title);
    setDescription(post.description);
    setShowModal(true);
  };

  const handleDelete = async (e, id) => {
    // e.preventDefault();
    await deletePost({ token, id })
      .unwrap()
      .then((fulfilled) => {
        if (fulfilled) {
          console.log(fulfilled);
          refetch();
          toast("post deleted successfully");
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

    if (title !== selectedPost.title) {
      payload.append("title", title);
    }

    if (description !== selectedPost.description) {
      payload.append("description", description);
    }
    // images.forEach((image) => {
    //   payload.append("images[]", image);
    // });
    for (let index = 0; index < images.length; index++) {
      payload.append("images[]", images[index]);
    }
    // payload.append("images[]", images);

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

    await updatePost({ token, id: selectedPost.id, payload })
      .unwrap()
      .then((fulfilled) => {
        if (fulfilled) {
          console.log(fulfilled);
          setShowModal(false);
          refetch();
          toast("post updated successfully");
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
                        title
                      </th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        author
                      </th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        description
                      </th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        images
                      </th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {posts?.posts?.map((post, index) => (
                      <tr key={index}>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <div className="flex items-center">
                            <div className="ml-3">
                              <p className="text-gray-900 whitespace-no-wrap">
                                {post.title}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <p className="text-gray-900 whitespace-no-wrap">
                            {post.user.name}
                          </p>
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <p className="text-gray-900 whitespace-no-wrap">
                            {post.description.slice(0, 100)}
                          </p>
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <div className="flex gap-2 overflow-x-auto">
                            {post?.media?.map((media, i) => (
                              <img
                                key={i}
                                className="w-20 h-20 rounded"
                                src={media.original_url}
                                alt={`Post image ${i}`}
                              />
                            ))}
                          </div>
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <span className=" flex gap-4 relative inline-block px-3 py-1 font-semibold  leading-tight">
                            <button
                              onClick={() => updateModal(post)}
                              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 border border-blue-500 rounded"
                            >
                              update
                            </button>
                            <button
                              onClick={(e) => handleDelete(e, post.id)}
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
      {showModal && selectedPost ? (
        <Modal open={showModal} onClose={() => setShowModal(false)}>
          <div className="flex flex-col gap-4">
            <div className="lg:col-span-2">
              <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5">
                <div className="md:col-span-5">
                  <label htmlFor="name">title</label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="md:col-span-5">
                  <label htmlFor="description">description</label>
                  <textarea
                    name="description"
                    id="description"
                    className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div className="md:col-span-5">
                  <label htmlFor="images">images</label>
                  <input
                    type="file"
                    name="images"
                    id="images"
                    multiple
                    className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                    onChange={(e) => setImages(e.target.files)}
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
