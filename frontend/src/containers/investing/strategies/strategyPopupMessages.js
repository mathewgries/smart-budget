export const SignalAlertPopupMessage = () => {
  return (
    <div>
      <p>The strategy already contains that signal!</p>
    </div>
  );
};

export const StrategyAlertPopupMessage = () => {
  return (
    <div>
      <p>A similar strategy name already exists!</p>
			<p>Please choose a different name</p>
    </div>
  );
};

export const DeleteStrategyConfirmMessage = () => {
  return (
    <div>
      <p>You are about to delete a strategy!</p>
      <p>The strategy will be removed from all orders as well</p>
      <p>Please Confrim!</p>
    </div>
  );
};

export const SignalRemoveConfirmMessage = () => {
  return (
    <div>
      <p>You are about to remove a signal from the strategy!</p>
      <p>
        If this strategy is applied to orders already, then this is
        <span style={{ color: "red" }}> NOT RECOMMENDED </span>
      </p>
      <p>
        If you are trying a new set up, it is recommended to create a new
        strategy
      </p>
      <p>Please Confrim!</p>
    </div>
  );
};

export const SignalDeleteConfirmMessage = () => {
  return (
    <div>
      <p>You are about to delete a signal!</p>
      <p>
        If the signal is applied to strategies in use, this is
        <span style={{ color: "red" }}> NOT RECOMMENDED </span>
      </p>
      <p>
        If you are trying a new set up, it is recommended to create a new
        strategy
      </p>
      <p>Please Confrim!</p>
    </div>
  );
};