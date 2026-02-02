import { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation, useOutletContext } from "react-router-dom";
import { AppContext } from "../../AppContext";
import { callApi } from "../../utils/Utils";
import Footer from "../../components/Layout/Footer";
import LoadApi from "../../components/Loading/LoadApi";
import IconArrowLeft from "/src/assets/svg/arrow-left.svg";
import IconArrowRight from "/src/assets/svg/arrow-right.svg";

const ProfileTransaction = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { contextData } = useContext(AppContext);
    const { isMobile } = useOutletContext();

    const getDefaultDates = () => {
        const now = new Date();
        const currentMonthFirst = new Date(now.getFullYear(), now.getMonth(), 1);
        const nextMonthFirst = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        return {
            dateFrom: formatDateForInput(currentMonthFirst),
            dateTo: formatDateForInput(nextMonthFirst),
        };
    };

    const formatDateForInput = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const [filters, setFilters] = useState(getDefaultDates());
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        start: 0,
        length: 5,
        totalRecords: 0,
        currentPage: 1,
    });

    const formatDateDisplay = (dateString) => {
        if (!dateString) return "—";
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "—";

        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();

        return `${day}.${month}.${year}`;
    };

    const formatBalance = (value) => {
        const num = value > 0 ? parseFloat(value) : Math.abs(value);
        if (isNaN(num)) return "";
        return num.toLocaleString("de-DE", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };

    const formatOperation = (operation) => {
        return operation === "change_balance" ? "change balance" : operation;
    };

    const handlePageChange = (page) => {
        setPagination((prev) => ({
            ...prev,
            start: (page - 1) * prev.length,
            currentPage: page,
        }));
    };

    const fetchHistory = () => {
        setLoading(true);

        const queryParams = new URLSearchParams({
            start: pagination.start,
            length: pagination.length,
            ...(filters.dateFrom && { date_from: filters.dateFrom }),
            ...(filters.dateTo && { date_to: filters.dateTo }),
            type: "slot"
        }).toString();

        const apiEndpoint = `/get-history?${queryParams}`;

        callApi(
            contextData,
            "GET",
            apiEndpoint,
            (response) => {
                if (response.status === "0" || response.status === 0) {
                    setTransactions(response.data || []);
                    setPagination((prev) => ({
                        ...prev,
                        totalRecords: response.recordsTotal || 0,
                    }));
                } else {
                    setTransactions([]);
                    console.error("API error:", response);
                }
                setLoading(false);
            },
            null
        );
    };

    useEffect(() => {
        if (!contextData?.session) {
            navigate("/");
        }
    }, [contextData?.session, navigate]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    useEffect(() => {
        fetchHistory();
    }, [pagination.start, pagination.length]);

    useEffect(() => {
        setPagination((prev) => ({
            ...prev,
            start: 0,
            currentPage: 1,
        }));
    }, [filters.dateFrom, filters.dateTo]);

    const totalPages = Math.ceil(pagination.totalRecords / pagination.length);

    const getVisiblePages = () => {
        const delta = 1;
        const visiblePages = [];
        let startPage = Math.max(1, pagination.currentPage - delta);
        let endPage = Math.min(totalPages, pagination.currentPage + delta);

        if (endPage - startPage + 1 < 2 * delta + 1) {
            if (startPage === 1) {
                endPage = Math.min(totalPages, startPage + 2 * delta);
            } else {
                startPage = Math.max(1, endPage - 2 * delta);
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            visiblePages.push(i);
        }

        return { visiblePages, startPage, endPage };
    };

    const { visiblePages } = getVisiblePages();

    const handleFirstPage = () => handlePageChange(1);
    const handlePrevPage = () => handlePageChange(Math.max(1, pagination.currentPage - 1));
    const handleNextPage = () => handlePageChange(Math.min(totalPages, pagination.currentPage + 1));
    const handleLastPage = () => handlePageChange(totalPages);

    return (
        <>
            <section className="section section--top section--cover">
                <header className="navigation-bar">
                    <button
                        className="navigation-bar__left"
                        type="button"
                        onClick={() => navigate(-1)}
                    >
                        <img src={IconArrowLeft} alt="Volver" />
                    </button>

                    <h1 className="navigation-bar__center body-semi-bold">
                        Historial de jugadas
                    </h1>
                </header>

                {loading ? (
                    <LoadApi />
                ) : transactions.length === 0 ? (
                    <div className="no-results">No hay transacciones en el período seleccionado</div>
                ) : (
                    <div className="container svelte-fzoequ">
                        {transactions.map((tx, index) => (
                            <div className="wrapper svelte-fzoequ" key={tx.id || index}>
                                <div className="heading svelte-fzoequ">{formatDateDisplay(tx.created_at || tx.created_at)}</div>
                                <div className="list-wrapper svelte-fzoequ">
                                    <div className="wrapper svelte-1pvn0xe">
                                        <div className="info-wrapper svelte-1pvn0xe">
                                            <div className="content-left svelte-1pvn0xe">
                                                <div className="type svelte-1pvn0xe">{parseFloat(tx.value) > 0 ? 'GANANCIA' : 'JUGADA'}</div>
                                                <div className="description svelte-1pvn0xe">Mercado pago</div>
                                            </div>
                                            <div className="content-right svelte-1pvn0xe">
                                                <div className="info svelte-1pvn0xe">
                                                    <bdi className="amount svelte-1pvn0xe">${formatBalance(tx.value || tx.amount)}</bdi>
                                                    {/* {
                                                        tx.value && tx.value < 0 && <div class="transaction-status svelte-1pvn0xe" style={{ color: "#f33" }}>Falló</div>
                                                    } */}
                                                </div>
                                                <img src={IconArrowRight} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="pagination">
                    <img src={IconArrowRight} style={{ transform: "rotate(180deg)" }} onClick={handlePrevPage} disabled={pagination.currentPage <= 1 || totalPages <= 1} />

                    {totalPages > 0 && visiblePages.map((page) => (
                        <span
                            key={page}
                            onClick={() => handlePageChange(page)}
                        >
                            {page}
                        </span>
                    ))}
                    <img src={IconArrowRight} onClick={handleNextPage} disabled={pagination.currentPage >= totalPages || totalPages <= 1} />
                </div>
            </section>

            <Footer />
        </>
    );
};

export default ProfileTransaction;