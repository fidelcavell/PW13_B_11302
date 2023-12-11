import {
  Container,
  Stack,
  Button,
  Spinner,
  Alert,
  Modal,
  Col,
} from "react-bootstrap";
import { useEffect, useState } from "react";

// import { useMutation } from "@tanstack/react-query";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

import { GetMyWatchList, DeleteWatchList } from "../api/apiWatchLater";
import { getThumbnail } from "../api";

const WatchLaterPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [watchList, setWatchList] = useState([]);
  const [show, setShow] = useState(false);

  const closeModal = () => setShow(false);
  const openModal = () => setShow(true);

  // ----------
  const deleteWatchList = (id) => {
    DeleteWatchList(id)
      .then((response) => {
        closeModal();
        toast.success(response.message);
        fetchWatchList();
      })
      .catch((err) => {
        toast.dark(err.message);
      });
  };

  const fetchWatchList = () => {
    setIsLoading(true);
    GetMyWatchList()
      .then((response) => {
        setWatchList(response);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };
  // ----------

  useEffect(() => {
    fetchWatchList();
  }, []);

  return (
    <Container className="mt-4">
      <Stack direction="horizontal" gap={3} className="mb-3">
        <h1 className="h4 fw-bold mb-0 text-nowrap">Watch Later Videos</h1>
        <hr className="border-top border-light opacity-50 w-100" />
      </Stack>
      {isLoading ? (
        <div className="text-center">
          <Spinner
            as="span"
            animation="border"
            variant="primary"
            size="lg"
            role="status"
            aria-hidden="true"
          />
          <h6 className="mt-2 mb-0">Loading...</h6>
        </div>
      ) : watchList?.length > 0 ? (
        <Container>
          {watchList?.map((watch) => (
            <div className="bg-dark d-flex my-3 rounded">
              <img
                src={getThumbnail(watch.content.thumbnail)}
                alt="Thumbnail"
                className="object-fit-cover"
                style={{ width: "200px", aspectRatio: "16 / 9" }}
              />
              <Col className="d-flex justify-content-between">
                <div className="px-3">
                  <h2>{watch.content.title}</h2>
                  <p>{watch.content.description}</p>
                </div>
                <div className="px-4 py-2">
                  <p>Tanggal ditambahkan : {watch.date_added}</p>
                  <div className="d-flex justify-content-end">
                  <Button variant="danger" onClick={openModal}>
                    <FaTrash />
                  </Button>
                  </div>
                  <Modal
                    show={show}
                    onHide={closeModal}
                    backdrop="static"
                    keyboard={false}
                  >
                    <Modal.Header closeButton>
                      <Modal.Title>
                        Apakah kamu yakin ingin menghapus ini dari watch later?
                      </Modal.Title>
                    </Modal.Header>
                    <Modal.Footer>
                      <Button variant="secondary" onClick={closeModal}>
                        Close
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => deleteWatchList(watch.id)}
                      >
                        Delete
                      </Button>
                    </Modal.Footer>
                  </Modal>
                </div>
              </Col>
            </div>
          ))}
        </Container>
      ) : (
        <Alert variant="dark" className="mt-3 text-center">
          Belum ada video Watch Later, yuk tambah video!
        </Alert>
      )}
    </Container>
  );
};

export default WatchLaterPage;
