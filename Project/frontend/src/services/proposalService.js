import http from "./httpService";

export const getProposals = (params) => http.get("/proposal/list", { params }).then(({ data }) => data.data);
export const addProposal = (data) => http.post("/proposal/add", data).then(({ data }) => data.data);
export const changeProposalStatus = ({ id, data }) => http.patch(`/proposal/${id}`, data).then(({ data }) => data.data);
