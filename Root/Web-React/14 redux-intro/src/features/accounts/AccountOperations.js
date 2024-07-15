import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deposit, withdraw, requesetLoan, payLoan } from "./accountSlice";

function AccountOperations() {
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [loanAmount, setLoanAmount] = useState("");
  const [loanPurpose, setLoanPurpose] = useState("");
  const [currency, setCurrency] = useState("USD");

  const dispatch =useDispatch();
  const {balance, isLoading, loan: currentLoan, loanPurpose: currentLoanPurpose} = useSelector((state) => state.account);

  function handleDeposit() {
    if(!depositAmount) return;
    dispatch(deposit(+depositAmount, currency));
    setDepositAmount('');
    setCurrency('USD')
  }

  function handleWithdrawal() {
    if(!withdrawalAmount) return;
    dispatch(withdraw(+withdrawalAmount));
    setWithdrawalAmount('');
  }

  function handleRequestLoan() {
    if(!loanAmount || !loanPurpose) return;
    dispatch(requesetLoan(+loanAmount, loanPurpose));
    setLoanAmount('');
    setLoanPurpose('');
  }

  function handlePayLoan() {
    if(balance - currentLoan < 0) return;
    dispatch(payLoan());
  }

  return (
    <div>
      <h2>Your account operations</h2>
      <div className="inputs">
        <div>
          <label>Deposit</label>
          <input
            type="number"
            value={depositAmount}
            onChange={(e) => setDepositAmount(+e.target.value)}
            placeholder="Add amount to diposit"
          />
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            <option value="USD">US Dollar</option>
            <option value="EUR">Euro</option>
            <option value="GBP">British Pound</option>
          </select>

          <button onClick={handleDeposit} disabled={isLoading}>{isLoading ? 'Convertign...' : `Deposit ${depositAmount}`}</button>
        </div>

        <div>
          <label>Withdraw</label>
          <input
            type="number"
            value={withdrawalAmount}
            onChange={(e) => setWithdrawalAmount(+e.target.value)}
            placeholder="Withdraw amount"
          />
          <button onClick={handleWithdrawal}>
            Withdraw {withdrawalAmount}
          </button>
        </div>

        <div>
          <label>Request loan</label>
          <input
            type="number"
            value={loanAmount}
            onChange={(e) => setLoanAmount(+e.target.value)}
            placeholder="Loan amount"
          />
          <input
            value={loanPurpose}
            onChange={(e) => setLoanPurpose(e.target.value)}
            placeholder="Loan purpose"
          />
          <button onClick={handleRequestLoan}>Request loan</button>
        </div>

        <div>
          <span>Pay back {+currentLoan} {currency} </span>
          <button onClick={handlePayLoan}>Pay loan</button>
        </div>
      </div>
    </div>
  );
}

export default AccountOperations;
