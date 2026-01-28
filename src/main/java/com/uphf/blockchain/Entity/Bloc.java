package com.uphf.blockchain.Entity;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;


public class Bloc {
    Header BlockHeader;
    Body BlockBody;

    public Bloc(Header blockHeader, Body blockBody) {
        BlockHeader = blockHeader;
        BlockBody = blockBody;
    }

    public Body getBlockBody() {
        return BlockBody;
    }

    public void setBlockBody(Body blockBody) {
        BlockBody = blockBody;
    }

    public Header getBlockHeader() {
        return BlockHeader;
    }

    public void setBlockHeader(Header blockHeader) {
        BlockHeader = blockHeader;
    }
}
