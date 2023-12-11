import { useEffect, useState } from "react";
import {
  Alert,
  Col,
  Container,
  Row,
  Spinner,
  Stack,
  Button,
} from "react-bootstrap";
import { FaStopwatch } from "react-icons/fa";
import { toast } from "react-toastify";

import { GetAllContents } from "../api/apiContent";
import { getThumbnail } from "../api";
import { CreateWatchList } from "../api/apiWatchLater";

const DashboardPage = () => {
  const [contents, setContents] = useState([]);
  const [idUser, setIdUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const createWatchList = (idUser, idContent) => {
    CreateWatchList(idUser, idContent)
      .then((response) => {
        toast.success(response.message);
      })
      .catch((err) => {
        console.log(err);
        toast.warn(JSON.stringify(err.message));
      });
  };

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    setIdUser(user.id);
    setIsLoading(true);
    
    GetAllContents()
      .then((data) => {
        setContents(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <Container className="mt-4">
      <Stack direction="horizontal" gap={3} className="mb-3">
        <h1 className="h4 fw-bold mb-0 text-nowrap">Rekomendasi Untukmu</h1>
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
      ) : contents?.length > 0 ? (
        <Row>
          {contents?.map((content) => (
            <Col md={6} lg={4} className="mb-3" key={content.id}>
              <div
                className="card text-white"
                style={{ aspectRatio: "16 / 9" }}
              >
                <img
                  src={getThumbnail(content.thumbnail)}
                  className="card-img w-100 h-100 object-fit-cover bg-light"
                  alt="..."
                />
                <div className="card-body">
                  <h5 className="card-title text-truncate">{content.title}</h5>
                  <p className="card-text">{content.description}</p>
                  <div className="d-flex justify-content-end">
                    <Button
                      variant="success"
                      onClick={() => createWatchList(idUser, content.id)}
                    >
                      <FaStopwatch className="mx-1 mb-1" />
                    </Button>
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      ) : (
        <Alert variant="dark" className="text-center">
          Tidak ada video untukmu saat ini ☹️
        </Alert>
      )}
    </Container>
  );
};

export default DashboardPage;
