import type { OrderDetail } from "@/constants";
import { render, screen } from "@testing-library/react";
import ShowDetailOrderTable from "./ShowDetailOrderTable";

const baseDetail: OrderDetail = {
  id: "od1",
  name: "FRONTLITE 280 GSM",
  width: 2,
  height: 1,
  qty: 1,
  design: 0,
  eyelets: true,
  shiming: false,
  description: "Test",
  MarkedPrinted: {
    id: "mp1",
    status: true,
    printAt: new Date().toISOString(),
    description: "-",
    PrintedBy: {
      id: "u1",
      username: "admin",
      email: "admin@example.com",
      name: "Admin",
      image: "",
      blocked: false,
      roleId: 1,
      role: { id: 1, name: "Admin" },
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
};

describe("ShowDetailOrderTable", () => {
  it("renders rows and status badge", () => {
    render(
      <ShowDetailOrderTable
        markedTaken={false}
        orderDetails={[baseDetail]}
        expandedRowId={null}
        onExpandedRowToggleHandler={() => {}}
        onCheckBoxPrintedClickHandler={() => {}}
        userRole="admin"
      />,
    );

    expect(screen.getByText("FRONTLITE 280 GSM")).toBeInTheDocument();
    expect(screen.getByText("Ya")).toBeInTheDocument();
    expect(screen.getByText("Tidak")).toBeInTheDocument();
  });

  it("shows checkbox for admin role and text for non-privileged role", () => {
    const { rerender } = render(
      <ShowDetailOrderTable
        markedTaken={false}
        orderDetails={[baseDetail]}
        expandedRowId={null}
        onExpandedRowToggleHandler={() => {}}
        onCheckBoxPrintedClickHandler={() => {}}
        userRole="admin"
      />,
    );

    expect(screen.getByRole("checkbox")).toBeInTheDocument();

    rerender(
      <ShowDetailOrderTable
        markedTaken={false}
        orderDetails={[baseDetail]}
        expandedRowId={null}
        onExpandedRowToggleHandler={() => {}}
        onCheckBoxPrintedClickHandler={() => {}}
        userRole="designer"
      />,
    );

    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
    expect(screen.getByText("Sudah")).toBeInTheDocument();
  });
});
