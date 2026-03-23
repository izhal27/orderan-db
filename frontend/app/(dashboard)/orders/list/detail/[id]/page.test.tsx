import { act, fireEvent, render, screen } from "@testing-library/react";
import type { ReactElement } from "react";
import DetailPage from "./page";

const mockOrder = {
  id: "o1",
  number: "DB-TEST",
  updatedAt: new Date().toISOString(),
  customer: "GOONERS",
  description: "-",
  user: { name: "Admin", username: "admin", image: "" },
  OrderDetails: [
    {
      id: "od1",
      name: "ITEM",
      width: 1,
      height: 1,
      qty: 1,
      design: 0,
      eyelets: true,
      shiming: false,
      description: "-",
      MarkedPrinted: { status: false },
    },
  ],
  MarkedPay: { status: false },
  MarkedTaken: { status: false },
};

let role = "admin";
jest.mock("next-auth/react", () => ({
  useSession: () => ({
    data: { user: { role, id: "1" }, accessToken: "t" },
    status: "authenticated",
  }),
}));

jest.mock("@/lib/useOrderStatusWebSocket", () => ({
  useOrderStatusWebSocket: () => ({ order: mockOrder, setOrder: jest.fn() }),
}));

jest.mock("@/lib/useApiClient", () => ({
  useApiClient: () => ({ request: jest.fn() }),
}));

jest.mock("@/context/LoadingContext", () => ({
  useLoading: () => ({ setLoading: jest.fn() }),
}));

jest.mock("@/lib/useMoment", () => ({
  useMoment: () => ({ moment: () => ({ format: () => "DATE" }) }),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({ back: jest.fn() }),
}));

describe("Order detail page actions", () => {
  it("shows Cetak Semua for admin/operator", async () => {
    role = "admin";
    await act(async () => {
      render(<DetailPage params={{ id: "1" }} />);
    });
    expect(screen.getByText("Cetak Semua")).toBeInTheDocument();
  });

  it("opens confirm modal when clicking Cetak Semua", async () => {
    role = "admin";
    await act(async () => {
      render(<DetailPage params={{ id: "1" }} />);
    });
    fireEvent.click(screen.getByText("Cetak Semua"));
    expect(screen.getByText("Cetak semua item?")).toBeInTheDocument();
  });

  it("hides action checkboxes for non-privileged role", async () => {
    role = "designer";
    await act(async () => {
      render(<DetailPage params={{ id: "1" }} />);
    });
    expect(screen.queryByText("Cetak Semua")).not.toBeInTheDocument();
    expect(screen.queryAllByRole("checkbox").length).toBe(0);
  });

  it("shows Dibayar/Diambil for admin and administrasi only", async () => {
    role = "admin";
    let rerender!: (ui: ReactElement) => void;
    await act(async () => {
      ({ rerender } = render(<DetailPage params={{ id: "1" }} />));
    });
    expect(screen.getByText("Dibayar")).toBeInTheDocument();
    expect(screen.getByText("Diambil")).toBeInTheDocument();

    role = "administrasi";
    await act(async () => {
      rerender(<DetailPage params={{ id: "1" }} />);
    });
    expect(screen.getByText("Dibayar")).toBeInTheDocument();
    expect(screen.getByText("Diambil")).toBeInTheDocument();

    role = "operator";
    await act(async () => {
      rerender(<DetailPage params={{ id: "1" }} />);
    });
    expect(screen.queryByText("Dibayar")).not.toBeInTheDocument();
    expect(screen.queryByText("Diambil")).not.toBeInTheDocument();
  });
});
