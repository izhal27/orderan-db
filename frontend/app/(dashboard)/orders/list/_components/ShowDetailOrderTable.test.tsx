import { render, screen } from "@testing-library/react";
import ShowDetailOrderTable from "./ShowDetailOrderTable";

const baseDetail = {
  id: "od1",
  name: "FRONTLITE 280 GSM",
  width: 2,
  height: 1,
  qty: 1,
  design: 0,
  eyelets: true,
  shiming: false,
  description: "Test",
  MarkedPrinted: { status: true },
};

describe("ShowDetailOrderTable", () => {
  it("renders rows and status badge", () => {
    render(
      <ShowDetailOrderTable
        markedTaken={false}
        orderDetails={[baseDetail as any]}
        expandedRowId={null}
        onExpandedRowToggleHandler={() => {}}
        onCheckBoxPrintedClickHandler={() => {}}
        role="admin"
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
        orderDetails={[baseDetail as any]}
        expandedRowId={null}
        onExpandedRowToggleHandler={() => {}}
        onCheckBoxPrintedClickHandler={() => {}}
        role="admin"
      />,
    );

    expect(screen.getByRole("checkbox")).toBeInTheDocument();

    rerender(
      <ShowDetailOrderTable
        markedTaken={false}
        orderDetails={[baseDetail as any]}
        expandedRowId={null}
        onExpandedRowToggleHandler={() => {}}
        onCheckBoxPrintedClickHandler={() => {}}
        role="designer"
      />,
    );

    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
    expect(screen.getByText("Sudah")).toBeInTheDocument();
  });
});
