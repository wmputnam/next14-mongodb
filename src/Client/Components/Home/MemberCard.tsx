import React from 'react';

export function MemberCard(params: any) {

  return (
    <div id={params.index}>
      <span>{params.lastName}</span>&nbsp;
      <span>{params.firstName}</span>&nbsp;
      <span>{params.email ? params.email : ""}</span>&nbsp;
      <span>{params.phone ? params.phone : ""}</span>&nbsp;
      <span>{params.mmb ? params.mmb : ""}</span>&nbsp;
    </div>
  );
}