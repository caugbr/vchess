<template>
    <div class="board">
        <table id="vchess-board" cellspacing="0" cellpadding="0" class="">
            <tbody>
                <tr class="hmeta top">
                    <td class="corner"></td>
                    <td :class="`meta col-${n}`" v-for="n in cols" :key="`ht${n}`">{{n}}</td>
                    <td class="corner"></td>
                </tr>
                <tr v-for="n in rows" :key="`v${n}`">
                    <td :class="`meta row-${n}`">{{n}}</td>
                    <td v-if="n === 8" colspan="8" rowspan="8" class="board-wrapper">
                        <table cellpadding="0" cellspacing="0" id="board">
                            <tbody>
                                <tr v-for="row in rows" :key="`tr${row}`">
                                    <td v-for="col in cols" :key="`td${col}`" :class="`square ${col}${row}`">
                                        <img 
                                            v-if="cellContent(col + row)" 
                                            :src="cellContent(col + row)" 
                                            alt="" 
                                            :class="cellClass(col + row)"
                                        >
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                    <td :class="`meta row-${n}`">{{n}}</td>
                </tr>
                <tr class="hmeta bottom">
                    <td class="corner"></td>
                    <td :class="`meta col-${n}`" v-for="n in cols" :key="`hb${n}`">{{n}}</td>
                    <td class="corner"></td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import store from '@/store';
import { mapGetters, mapMutations } from "vuex";
import DragAndDrop from "../DragAndDrop.js";

export default {
    name: "Board",
    store,
    data() {
        return {
            cols: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
            rows: [8, 7, 6, 5, 4, 3, 2, 1],
            dnd: null
        };
    },
    computed: {
        ...mapGetters(['lang', 'board', 'theme', 'nextMove']),
        imgUrl() {
            return `/themes/${this.theme}/img/`;
        }
    },
    methods: {
        ...mapMutations(['updatePiece', 'switchPlayers', 'isWaiting']),
        cellContent(coords) {
            const board = this.getBoard();
            if ('' !== board[coords]) {
                return this.imgUrl + board[coords] + '.png';
            }
            return '';
        },
        cellClass(coords) {
            const board = this.getBoard();
            let cls = '';
            if ('' !== board[coords]) {
                cls += 'piece origin-' + coords;
                cls += ' type-' + board[coords].substr(1, 1);
                cls += ' ' + (board[coords].substr(0, 1) === 'w' ? 'white' : 'black');
            }
            return cls;
        },
        applyDnD() {
            if (this.dnd === null) {
                console.log('DnD', this.nextMove)
                this.dnd = new DragAndDrop({
                    dragSelector: `img.piece.${this.nextMove}`,
                    dropSelector: 'td.square',
                    centerOnGet: true
                });
                this.dnd.canDrop = info => {
                    const piece = info.dropTarget.querySelector('img');
                    if (piece) {
                        if (info.element.classList.contains('white') && piece.classList.contains('white') ||
                            info.element.classList.contains('black') && piece.classList.contains('black')) {
                            return false;
                        }
                    }
                    return true;
                };
                this.dnd.onDrop = info => {
                    this.isWaiting(true);
                    const piece = info.dropTarget.querySelector('img');
                    if (piece) {
                        info.dropTarget.removeChild(piece);
                    }
                    
                    setTimeout(() => {
                        this.updatePiece(info);
                        this.$emit('changed');
                        this.applyDnD();
                        this.isWaiting(false);
                    }, 260);
                };
            }
        },
        getBoard() {
            return { ...this.board };
        }
    },
    mounted() {
        console.log('mounted')
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                let cls = 'black';
                if (r % 2 == 0 && c % 2 == 0 || r % 2 == 1 && c % 2 == 1) {
                    cls = 'white';
                }
                document.querySelector(`.square.${this.cols[c]}${this.rows[r]}`).classList.add(cls);
            }
        }
        this.applyDnD();
    }
};
</script>

<style lang="scss">
.board {
    #vchess-board {
        /* desabilita seleção do texto dentro do tabuleiro */
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }
    
    #vchess-board td.meta {
        width: 20px;
        height: 60px;
        text-align: center;
        vertical-align: middle;
        color: #666;
        font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
        font-size: 10px;
        text-transform: uppercase;
    }
    
    #vchess-board tr.hmeta td.meta {
        width:60px;
        height:20px;
    }
    
    #vchess-board.no-coords td.meta {
        color: rgba(0, 0, 0, 0);
    }
    
    #board {
        width: auto;
        height: auto;
        border: 1px solid #ccc;
        margin: 0 !important;
    }
    
    #board td {
        width: 60px;
        height: 60px;
        min-width: 60px;
        max-height: 60px;
        overflow: hidden;
        text-align: center;
        vertical-align: middle;
    }
    
    // #board td.droppable {
    //     background-color: #FFA26B;
    // }
    
    #board td.piece-over {
        background-color: #d48a5f;
    }
    
    #board td .piece {
        display: block;
        margin: auto;
        max-width: 84%;
        transition: opacity 220ms ease-out 0s;
    }
    
    #board td .piece.defcur {
        cursor: default;
    }
    
    #board td.can-drop .piece {
        opacity: 0.2;
    }
    
    #board td.white {
        background-color: #FFF;
    }
    
    #board td.black {
        background-color: #aaa;
    }
    
    #board td.white.can-drop {
        background-color: #EEE;
    }
    
    #board td.black.can-drop {
        background-color: #949494;
    }
}
</style>