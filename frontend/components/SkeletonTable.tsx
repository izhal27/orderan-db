import { Table } from "flowbite-react";

interface props {
  columnsName: string[];
}

export default function SkeletonTable({ columnsName }: props) {
  const rows = 5;
  return (
    <Table className="overflow-hidden rounded-xl border border-gray-200 bg-white text-sm shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <Table.Head className="bg-gray-50 text-xs uppercase tracking-wide text-gray-600 dark:bg-gray-800 dark:text-gray-300">
        <Table.HeadCell className="text-center">
          {columnsName[0]}
        </Table.HeadCell>
        {Array.from({ length: columnsName.length - 1 }).map((_, index) => (
          <Table.HeadCell className="text-center" key={index}>
            {columnsName[index + 1]}
          </Table.HeadCell>
        ))}
      </Table.Head>
      <Table.Body className="divide-y divide-gray-100 dark:divide-gray-800">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <Table.Row
            key={rowIndex}
            className="bg-white text-center dark:border-gray-700 dark:bg-gray-900"
          >
            {Array.from({ length: columnsName.length }).map((_, colIndex) => (
              <Table.Cell key={colIndex}>
                <div className="h-2 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
              </Table.Cell>
            ))}
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}
