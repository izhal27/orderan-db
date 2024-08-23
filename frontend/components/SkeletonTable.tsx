import { Table } from 'flowbite-react';

interface props {
  columnsName: string[];
}

export default function SkeletonTable({ columnsName }: props) {
  const rows = 5;
  return (
    <Table>
      <Table.Head>
        <Table.HeadCell>
          {columnsName[0]}
        </Table.HeadCell>
        {Array.from({ length: columnsName.length - 1 }).map((_, index) => (
          <Table.HeadCell key={index}>
            {columnsName[index + 1]}
          </Table.HeadCell>
        ))}
      </Table.Head>
      <Table.Body>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <Table.Row key={rowIndex}>
            {Array.from({ length: columnsName.length }).map((_, colIndex) => (
              <Table.Cell key={colIndex}>
                <div className="h-2 bg-gray-200 rounded w-full animate-pulse"></div>
              </Table.Cell>
            ))}
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};