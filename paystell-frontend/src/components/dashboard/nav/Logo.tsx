import React from 'react';
import Image from 'next/image';

export function Logo() {
  return (
    <Image
      src="/imagotype-paystell-main.svg"
      alt="PayStell Logo"
      width={32}
      height={32}
      priority
      className="h-8 w-auto"
    />
  );
}
