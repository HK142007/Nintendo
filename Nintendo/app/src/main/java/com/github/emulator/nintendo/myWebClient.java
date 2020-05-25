package com.github.emulator.nintendo;

import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.net.MailTo;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

public class myWebClient extends WebViewClient
	{
    public void onPageStarted(WebView view, String url, Bitmap favicon)
    	{
        super.onPageStarted(view, url, favicon);
    	}

    public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error)
		{
		try
			{
			if(view!=null)
				{
				String htmlData = loadAssetTextAsString("EmulatrixNoInternet.htm", view.getContext());
				view.loadUrl("about:blank");
				view.loadDataWithBaseURL(null,htmlData, "text/html", "UTF-8",null);
				view.invalidate();
				}
			}
			catch(Exception e)
			{
			}
		}

    public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request)
    	{
		try
			{
			if(request.getUrl().toString().startsWith("mailto:"))
				{
				MailTo mt = MailTo.parse(request.getUrl().toString());
				Intent i = new Intent(Intent.ACTION_SEND);
				i.setType("text/plain");
				i.putExtra(Intent.EXTRA_EMAIL, new String[]{mt.getTo()});
				i.putExtra(Intent.EXTRA_SUBJECT, mt.getSubject());
				i.putExtra(Intent.EXTRA_CC, mt.getCc());
				i.putExtra(Intent.EXTRA_TEXT, mt.getBody());
				view.getContext().startActivity(i);
				view.reload();
				return true;
				}
			}
			catch(Exception e)
			{
			return true;
			}

		view.loadUrl(request.getUrl().toString());
        return true;
    	}

    public void onPageFinished(WebView view, String url)
    	{
        super.onPageFinished(view, url);
    	}

	private String loadAssetTextAsString(String name, Context myContext)
		{
		BufferedReader in = null;
		try
			{
			StringBuilder buf = new StringBuilder();
			InputStream is = myContext.getAssets().open(name);
			in = new BufferedReader(new InputStreamReader(is));

			String str;
			boolean isFirst = true;
			while ((str=in.readLine())!=null)
				{
				if (isFirst)
					{
					isFirst = false;
					}
					else
					{
					buf.append("\n");
					}
				buf.append(str);
				}
			return buf.toString();
			}
			catch (IOException e)
			{
			}
			finally
			{
			if (in!=null)
				{
				try
					{
					in.close();
					}
					catch (IOException e)
					{
					}
				}
			}
		return null;
		}
	}