// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetPostByIdQuery,
  useDeletePostMutation,
  useUpdatePostMutation,
} from "../redux/API/PostsApiSlice";
import moment from "moment";
import { ImageCarousel } from "./ImageCarousel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { useState } from "react";
import { Modal } from "./Modal";

export const PostDetails = () => {
  const { id } = useParams();
  const token = sessionStorage.getItem("token");
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState();
  const [description, setDescription] = useState();
  const [images, setImages] = useState([]);
  const {
    data: post,
    // isLoading,
    // isFetching,
    // isError,
    refetch,
  } = useGetPostByIdQuery({ token, id });
  const [deletePost] = useDeletePostMutation();
  const [updatePost] = useUpdatePostMutation();

  const updateModal = (e) => {
    e.preventDefault();
    console.log(post?.post?.title);
    setTitle(post?.post?.title);
    setDescription(post?.post?.description);
    setShowModal(true);
  };

  const handleDelete = async (e) => {
    e.preventDefault();

    await deletePost({ token, id })
      .unwrap()
      .then((fulfilled) => {
        if (fulfilled) {
          console.log(fulfilled);
          navigate("/");
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

    if (title !== post?.title) {
      payload.append("title", title);
    }

    if (description !== post?.description) {
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

    await updatePost({ token, id, payload })
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

  return (
    <>
      <div className="max-w-7xl mx-auto my-10 p-6 bg-white rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">{post?.post?.title}</h1>
          <span className="bg-red-500 text-white px-2 py-1 rounded-md">
            {moment(post?.post?.created_at).format("MMM Do YYYY")}
          </span>
        </div>
        <div className="flex flex-col md:flex-row">
          <div className="md:w-2/3">
            <ImageCarousel images={post?.post?.media} />
            {/* <div className="mt-4 space-x-4 flex justify-center">
            {apartmentData?.apartment?.Images?.map((image, index) => (
              <Image
                key={index}
                src={image.img_link}
                alt={`Thumbnail ${image.title}`}
                className="w-24 h-24 object-cover rounded-md"
                width={100}
                height={100}
              />
            ))}
          </div> */}
          </div>
          <div className="md:w-1/3 md:pl-6 mt-4 md:mt-0">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              <div className="flex items-center">
                <FontAwesomeIcon icon={faPen} className="text-gray-700 mr-2" />
                <span>{post?.post?.user?.name}</span>
              </div>
              {/* <div className="flex items-center">
              <FontAwesomeIcon icon={faBath} className="text-gray-700 mr-2" />
              <span>{apartmentData?.apartment?.bathrooms} Bath</span>
            </div> */}
            </div>
            <div className="flex gap-4">
              <button
                onClick={(e) => updateModal(e)}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                edit
              </button>
              <button
                onClick={(e) => handleDelete(e)}
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-blue-600"
              >
                delete
              </button>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <h2 className="text-2xl font-semibold">Description</h2>
          <p className="mt-2 text-gray-700">{post?.post?.description}</p>
        </div>
      </div>
      {showModal ? (
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
