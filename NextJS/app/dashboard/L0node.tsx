import { Button } from '@/components/ui/button';
import { TypographyH4, TypographyH3 } from '@/components/ui/typography';
import React, { memo, useEffect, useState } from 'react';
import {
  Handle,
  Position,
  type NodeProps,
} from 'reactflow';
import { Icons } from '@/components/icons';

function L0Node({ data }: NodeProps<{
  title: string;
  expanded: boolean;
  isHighlighted: boolean;
  data: {
    title: string;
    rows: string[] | number[];
  }[];
}>) {
  const [isExpanded, setIsExpanded] = useState<boolean>(data.expanded);

  useEffect(() => {
    setIsExpanded(data.expanded);
  }, [data.expanded]);

  if (!isExpanded) {
    return (
      <div
        style={{
          background: '#2cae8f',
          color: '#fff',
          padding: 10,
          fontSize: 12,
          borderRadius: 10,
          minWidth: 300,
          maxWidth: 500,
          transition: 'border-width 0.1s ease',
        }}
      >
        <TypographyH3>{data.title}</TypographyH3>
        {data.isHighlighted && (
          <Button
            variant="ghost"
            className="absolute -right-12 top-1 rounded-full border-0 border-[#423629] text-[#fff] bg-[#2cae8f] font-extrabold hover:bg-[#2cae8f] hover:text-[#fff] hover:border-[#423629] hover:border-2"
            style={{ height: '40px', width: '40px' }}
            onClick={() => setIsExpanded(true)}
          >
            <Icons.expand size={24} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-5 h-5" />
          </Button>
        )}

        <Handle type={'source'} position={Position.Left} id="left" />
        <Handle type={'source'} position={Position.Bottom} id="bottom" />
        <Handle type={'source'} position={Position.Right} id="right" />
        <Handle type={'source'} position={Position.Top} id="top" />
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        style={{
          background: '#2cae8f',
          color: '#fff',
          padding: 10,
          fontSize: 12,
          borderRadius: 10,
          minWidth: 300,
          maxWidth: 500,
          transition: 'border-width 0.1s ease',
        }}
      >
        <div className="flex justify-between">
          <TypographyH3>{data.title}</TypographyH3>
          <Button variant="ghost" className="rounded-full text-[#fff] font-extrabold hover:bg-[#2cae8f] hover:text-[#fff]" onClick={() => setIsExpanded(false)}>
            <Icons.close size={24} className="w-5 h-5 mb-3" />
          </Button>
        </div>
        <div style={{ marginTop: 5, maxWidth: '500px', overflowX: 'auto' }} className="flex flex-row gap-2 border border-white rounded-lg p-2">
          {data.data.map((item) => (
            <div key={item.title} className="flex flex-col gap-2">
              <TypographyH4 key={item.title}>{item.title}</TypographyH4>
              <div style={{ minWidth: '150px' }}>
                {item.rows.map((row) => (
                  <p key={row} className="text-lg">{row}</p>
                ))}
              </div>
            </div>
          ))}
        </div>

        <Handle type={'source'} position={Position.Left} id="left" />
        <Handle type={'source'} position={Position.Bottom} id="bottom" />
        <Handle type={'source'} position={Position.Right} id="right" />
        <Handle type={'source'} position={Position.Top} id="top" />
      </div>
    </div>
  );
}

export default memo(L0Node);
