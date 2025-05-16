let baseInfo = {} as any

export async function upload(expScoreDetails: Record<string, any>[]) {
  if (Object.keys(baseInfo).length === 0) {
    await getBaseInfo({
      success: function (res) {
        // 纯web客户端调用

        baseInfo = res
        /**
			 * res返回信息
			 * {
				  "  appId": "95d1fd12-00b8-49c7-8de2-94e2f680ae2f",
				    "expId": "28",
					"sequenceCode":"121313",
				   " userCode": "19970295622499691",
					"userName": "19970295622499691",
				    "host": "http://vr.owvlab.com/"
				}
			 */
      },
    })
  }

  await uploadResultData({
    appId: baseInfo.appId,
    expId: baseInfo.expId,
    version: "1.0", //版本号  必填
    reportData: [{ text1: "测试" }, { text2: { text: "测试1", color: "red" } }],
    expScoreDetails,
    expScriptContent: "",
    success: function (res) {
      console.log("【uploadResultData】成功：", res)
    },
    error: function (res) {
      console.log("【uploadResultData】失败：", res)
    },
  })
}
