import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { faThumbsUp, faThumbsDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Axios from "axios";

const Comment_Box = () => {
  const [comments, setComments] = useState([]);
  const [input, setInput] = useState("");
  const [name, setName] = useState("");
  const [hook, setHook] = useState(false);
  const commentHandler = () => {
    Axios.post("http://localhost:8080/comment/insert.php", {
      name: name,
      comment: input,
      likes: 0,
      dislikes: 0,
    }).then(({ data }) => {
      if (data.success === 1) {
        console.log(data.id);
        setComments([
          ...comments,
          {
            id: data.id,
            name: name,
            comment: input,
            likes: 0,
            dislikes: 0,
          },
        ]);
        setInput("");
        setName("");
      }
    });
  };

  const likeHandler = (Id) => {
    comments.map((comment) => {
      if (comment.id === Id) {
        let likes = Number(comment.likes) + 1;
        comment.likes = likes;
        Axios.post("http://localhost:8080/comment/update_likes.php", {
          id: Id,
          likes: likes,
        }).then(({ data }) => {
          if (data.success === 1) {
          }
        });
      }
    });
    setHook(!hook);
  };
  const dislikeHandler = (Id) => {
    comments.map((comment) => {
      if (comment.id === Id) {
        let dislikes = Number(comment.dislikes) + 1;
        Axios.post("http://localhost:8080/comment/update_dislikes.php", {
          id: Id,
          dislikes: dislikes,
        }).then(({ data }) => {
          if (data.success === 1) {
          }
        });
      }
    });
    setHook(!hook);
  };

  useEffect(() => {
    fetch("http://localhost:8080/comment/comment_list.php").then((response) => {
      response.json().then((data) => {
        setComments(data.comments.reverse());
      });
    });
  }, [comments.length, hook]);

  return (
    <div className="">
      <div className="w-50 p-5">
        <div className="mb-2">
          <input
            type="text"
            name=""
            value={name}
            placeholder="Enter your name..."
            className="form-control"
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </div>
        <div>
          <textarea
            name=""
            id=""
            rows="3"
            className="form-control"
            placeholder="Enter your comment..."
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
            }}
            required
          ></textarea>
        </div>
        <div className="row justify-content-end p-3">
          <button className="btn btn-danger" onClick={commentHandler}>
            Comment
          </button>
        </div>
        {comments.map((comment) => (
          <div className="card p-3" key={comment.id}>
            <h6>{comment.name}</h6>
            <div className="d-flex justify-content-between">
              <div>{comment.comment} </div>
              <div className="">
                <div className="d-flex pr-3">
                  <FontAwesomeIcon
                    icon={faThumbsUp}
                    onClick={() => likeHandler(comment.id)}
                    className="cursor-pointer"
                  />
                  {comment.likes}
                </div>
                <div className="d-flex">
                  <FontAwesomeIcon
                    icon={faThumbsDown}
                    className="fa-flip-horizontal"
                    onClick={() => dislikeHandler(comment.id)}
                    className="cursor-pointer"
                  />
                  {comment.dislikes}{" "}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comment_Box;
