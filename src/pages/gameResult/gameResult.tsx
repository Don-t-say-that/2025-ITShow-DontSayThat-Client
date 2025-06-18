import { useEffect } from "react";
import styles from "./gameResult.module.css";
import "../../App.css";
import axios from "axios";
import { useGameResultStore } from "../../store/rankingStore";
import { FaHome } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface RankingItem {
    id: number;
    user: {
        name: string;
    };
    score: number;
    rank?: number;
}

function GameResult() {
    const { ranking, setRanking } = useGameResultStore();
    const teamId = 66;  // roomstore에서 teamid 가져와서 쓰삼

    const navigate = useNavigate();
    const handleHomeClick = () => {
        navigate("/menu");
    };

    useEffect(() => {
        const fetchRanking = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/teams/${teamId}/ranking`);
                const data = res.data;

                if (data.length >= 2) {
                    const sortedData = data.sort((a: RankingItem, b: RankingItem) => b.score - a.score);
                    let currentRank = 1;
                    const finalRanking = sortedData.map((item: RankingItem, index: number) => {
                        if (index === 0) {
                            item.rank = 1;
                        } else {
                            if (sortedData[index].score === sortedData[index - 1].score) {
                                item.rank = sortedData[index - 1].rank;
                            } else {
                                currentRank = index + 1;
                                item.rank = currentRank;
                            }
                        }
                        return item;
                    });
                    setRanking(finalRanking);
                }
            } catch (err) {
                console.error("랭킹 데이터 가져오기 실패:", err);
            }
        };

        fetchRanking();
    }, [teamId, setRanking]);

    return (
        <div className={styles.background}>
            <h1 className={styles.title}>게임 결과</h1>
            <div className={styles.board}>
                <div className={styles.content}>
                    {ranking.length >= 2 ? (
                        ranking.map((item: RankingItem) => (
                            <div className={styles.rowRanking} key={item.id}>
                                <p className={styles.order}>{item.rank || '?'}</p>
                                <p>{item.user.name}</p>
                                <p>{item.score}점</p>
                            </div>
                        ))
                    ) : (
                        <p className={styles.rowRanking}>2명 이상일 때만 결과가 표시됩니다.</p>
                    )}
                </div>
            </div>
            <div className={styles.homeButton}>
                <div className={styles.homeIcon} onClick={handleHomeClick}>
                    <FaHome size={70} color="#F8AE01" />
                </div>
            </div>
        </div>
    );
}

export default GameResult;
