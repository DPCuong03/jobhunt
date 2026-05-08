import Link from "next/link";

const FooterBottom = () => {
    return (
        <div className="footer-bottom">
            <div className="container">
                <div className="row">
                    <div className="col-lg-6 col-md-6">
                        <div className="copyright">Copyright text here</div>
                    </div>
                    <div className="col-lg-6 col-md-6">
                        <div className="right">
                            <ul>
                                <li>
                                    <Link href="/terms">Terms of Use</Link>
                                </li>
                                <li>
                                    <Link href="/privacy">Privacy Policy</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FooterBottom;
