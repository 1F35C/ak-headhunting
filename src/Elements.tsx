import { useState, useEffect } from 'react';
import {
  Operator,
  Region,
  ReleaseInfo,
} from './Types';

import { daysSince, getImage } from './util';

type ShopOperatorCardParams = {
  operator: Operator,
  prediction: number
}

export function shopOperatorStatus(releaseInfo: ReleaseInfo, prediction: number) {
  if (releaseInfo.shop.length === 0) {
    return (
      <>
      Expected<br />
      <strong>in { -daysSince(prediction) }d</strong>
      </>
    );
  } else if (releaseInfo.shop[0].start < Date.now() && Date.now() < releaseInfo.shop[0].end) {
    return (
      <>
      Currently Active
      </>
    );
  }
  return (
    <>
    Debuted<br />
    <strong>{ daysSince(releaseInfo.shop[0].start) }d ago</strong>
    </>
  ); 

}

function ShopOperatorCard(params:ShopOperatorCardParams) {
  let releaseInfo = params.operator.EN;
  let daysSinceRelease = daysSince(releaseInfo.released);
  let status = shopOperatorStatus(releaseInfo, params.prediction);
  return (
    <div className="card operator-card">
      <div className="card-image">
        <figure className="image is-1by1">
          <img src={ getImage('portraits', params.operator.name) }
               title={ params.operator.name }
               style={ { pointerEvents: 'none' } }
               alt="" />
        </figure>
      </div>
      <div className="card-content">
        <div className="title is-4">{ params.operator.name }</div>
        <p>
        Released<br />
        <strong>{ daysSinceRelease }d ago</strong>
        </p>
        { status }
        <p>
        </p>
      </div>
    </div>
  );
}

type DragGrab = {
  grabX: number,
  scrollX: number
}

export type CertShopOperatorsParams = {
  operators: Operator[]
  predictions: number[]
  focus?: "left" | "center"
}

export function CertShopOperators(params: CertShopOperatorsParams) {

  let [dragGrab, setDragGrab] = useState<DragGrab | null>(null);

  let shopOperatorCardColumns = params.operators.map((op, idx) => {
    return (
      <div className="column" key={ op.name }>
        <ShopOperatorCard operator={ op } prediction={ params.predictions[idx] }/>
      </div>
    );
  });

  useEffect(() => {
    const container = document.getElementById("operator-card-container");
    if (!container) {
      throw new Error("Operator card container not found");
    }

    // Center container
    if (params.focus === "center") {
      let scrollAmount = (container.scrollWidth - container.offsetWidth) / 2;
      container.scrollLeft = scrollAmount;
    }

    (() => {
      // Use closure to keep the scope tight for these variable
      let dragGrab: DragGrab | null = null;
      const container = document.getElementById("operator-card-container");

      if (!container) {
        throw new Error('container could not be found');
      }

      const mouseMove = (ev: MouseEvent) => {
        if (dragGrab === null) {
          return false;
        }
        container.scrollLeft = dragGrab.scrollX - (ev.clientX - dragGrab.grabX);
        return false;
      };

      const mouseUp = (ev: MouseEvent) => {
        setDragGrab(null);
        window.removeEventListener('mousemove', mouseMove);
        window.removeEventListener('mouseup', mouseUp);
      };

      const mouseDown = (ev: MouseEvent) => {
        dragGrab = {
          grabX: ev.clientX,
          scrollX: container.scrollLeft
        };
        window.addEventListener('mousemove', mouseMove);
        window.addEventListener('mouseup', mouseUp);
      };

      container.addEventListener('mousedown', mouseDown);
    })();
  }, []);
  

  return (
    <div id="operator-card-container">
      <div className="columns is-mobile">
        { shopOperatorCardColumns }
      </div>
    </div>
  );
}

